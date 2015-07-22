"""
ComplexHTML XBlock for edX
Author: Raymond Lucian Blaga
Description: An HTML, JavaScript and CSS Editing XBlock that records student interactions if the course author wishes it.
"""

import urllib, datetime, json
from .utils import render_template, load_resource, resource_string
from django.template import Context, Template
from xblock.core import XBlock
from xblock.fields import Scope, Integer, List, String, Boolean
from xblock.fragment import Fragment

class ComplexHTMLXBlock(XBlock):

    display_name = String(
        display_name="ComplexHTML XBlock",
        help="This name appears in the horizontal navigation at the top of the page",
        scope=Scope.settings,
        default="ComplexHTML XBlock"
    )

    record_click = Boolean(
        help="Record student click?",
        default=True, scope=Scope.content
    )

    record_hover = Boolean(
        help="Record student hovers? (Note that this will flood the database; use with caution)",
        default=False, scope=Scope.content
    )

    dependencies = String(
        help="List of JS and CSS dependencies to be used in this XBlock",
        default="", scope=Scope.content
    )

    body_html = String(
        help="HTML code of the block",
        default="<p>Body of the block goes here...</p>", scope=Scope.content
    )

    body_tracked = String(
        help="List of tracked elements",
        default="p", scope=Scope.content
    )

    body_js_chunk_1 = String(
        help="JavaScript code for the block",
        default="console.log(\"Code before onload.\");", scope=Scope.content
    )

    body_js_chunk_2 = String(
        help="JavaScript code for the block, chunk #2",
        default="console.log(\"Onload event!\");", scope=Scope.content
    )

    body_json = String(
        help="JSON container that can be used by the JavaScript code above",
        default="{\"sample\": { \"subsample\": \"true\" }}", scope=Scope.content
    )

    body_css = String(
        help="CSS code for the block",
        default="p { color: red }", scope=Scope.content
    )

    settings_student = String(
        help="Student-specific settings for student view in JSON form; initially a copy of body_json",
        default="", scope=Scope.user_state
    )

    grabbed = List(
        help="Student interaction that was grabbed from XBlock.",
        default=[], scope=Scope.user_state
    )

    completed = Boolean(
        help="Completion status of this slide for the student.",
        default=False, scope=Scope.user_state
    )

    has_score = True
    icon_class = 'other'

    @XBlock.json_handler
    def get_dependencies(self, data, suffix=''):
        return {"dependencies": self.dependencies}

    @XBlock.json_handler
    def get_body_html(self, data, suffix=''):
        return {"body_html": self.body_html}

    @XBlock.json_handler
    def get_body_css(self, data, suffix=''):
        return {"body_css": self.body_css}

    @XBlock.json_handler
    def get_body_js(self, data, suffix=''):
        return {"body_js": ("Chunk 1: \n" + self.body_js_chunk_1 + "\nChunk 2:\n" + self.body_js_chunk_2)}

    @XBlock.json_handler
    def get_body_json(self, data, suffix=''):
        return {"body_json": self.body_json}

    @XBlock.json_handler
    def get_settings_student(self, data, suffix=''):
        return {"json_settings": self.settings_student}

    @XBlock.json_handler
    def get_grabbed_data(self, data, suffix=''):
        return {"grabbed_data": self.grabbed}

    @XBlock.json_handler
    def get_completion_status(self, data, suffix=''):
        return {"completed": self.completed}

    def get_time_delta(self):
        """
        Return time difference between current grabbed input and the previous one.
        """
        return self.grabbed[-1] - self.grabbed[-2]

    @XBlock.json_handler
    def grab_data(self, data, suffix=''):
        """
        Grab data from recordable fields and append it to self.grabbed.
        """

        print ("CHX: Grabbed data from student: " + str(data))

        content = {"time": str(datetime.datetime.now())}
        chunk = []

        for i in data:
            chunk.append((str(i), str(data[i])))

        if len(chunk) > 0:
            self.grabbed.append((content["time"], chunk))
            content["data"] = chunk

        else:
            self.grabbed.append((content["time"], "crickets"))
            content["data"] = None

        print "Grabbed data on " + self.grabbed[-1][0]
        for i in self.grabbed[-1][1]:
            print "+--" + str(i)

        return content

    @XBlock.json_handler
    def clear_data(self, data, suffix=''):
        """
        Clear data grabbed from student
        """
        self.grabbed = []
        return {"cleared": "yes"}

    @XBlock.json_handler
    def update_student_settings(self, data, suffix=''):
        """
        Update student settings from AJAX request
        """
        if self.settings_student != data["json_settings"]:
            self.settings_student = data["json_settings"]
            return {"updated": "true"}
        return {"updated": "false"}

    @XBlock.json_handler
    def complete_block(self, data, suffix=''):
        """
        Mark this XBlock as completed for the student
        """
        self.completed = True
        return {}

    @staticmethod
    def url_loader(strin, sep):
        """
        Load contents of all URLs from strin, separated by sep and return a compiled string
        """
        strout = ""

        for line in strin.split(sep):
            if line[:4] == "http":
                strout += urllib.urlopen(line).read().decode('utf-8')
            # else ignore line

        return strout

    @staticmethod
    def generate_html(html):

        result = "<div class=\"complexhtml_xblock\">"
        # Assume valid HTML code
        result += html
        result += "</div>"

        return result

    @staticmethod
    def generate_js(jsa, jsb, tracked="", record=[]):

        # Load first chunk of the JS script
        result = load_resource('static/js/complexhtml_lms_chunk_1.js')

        # Generate AJAX request for each element that will be tracked
        tracked_str = ""

        for i in tracked.split("\n"):

            if "click" in record:
                e = i.split(", ")
                tracked_str += "recordClick(\'" + e[0] + "\'"
                if len(e) > 1:
                    tracked_str += ", \'" + e[1] + "\'"
                tracked_str += ");\n"

            if "hover" in record:
                e = i.split(", ")
                tracked_str += "recordHover(\'" + e[0] + "\'"
                if len(e) > 1:
                    tracked_str += ", \'" + e[1] + "\'"
                tracked_str += ");\n"

        # Adding tracking calls
        result += "/* Elements being recorded go here */\n" + tracked_str

        # Add first staff entered chunk - ie the code running before the onLoad
        result += "\n\n/* Staff entered JS code */\n"
        result += "try {\n"

        # convert all

        result += "eval(\"" +jsa.replace("\"", "\\\"").replace("\'", "\\\'") + "\");"

        result += "\n\n} catch (err) {\n"
        result += "    console.log(\"ComplexHTML caught this error in pre-run JavaScript code: \" + err);\n"
        result += "    $(\'.chx_javascript_error\').show();\n"
        result += "    $(\'.complexhtml_xblock\').hide();\n"
        result += "}\n"

        # Add second JavaScript chunk
        result += "\n" + load_resource('static/js/complexhtml_lms_chunk_2.js')

        # Add second staff entered chunk - ie the code running on page load
        result += "\n/* Staff entered JS code */\n"
        result += "try {\n"

        result += "eval(\"" +jsb.replace("\"", "\\\"").replace("\'", "\\\'") + "\");"

        result += "\n\n} catch (err) {\n"
        result += "    console.log(\"ComplexHTML caught this error in pre-run JavaScript code: \" + err);\n"
        result += "    $(\'.chx_javascript_error\').show();\n"
        result += "    $(\'.complexhtml_xblock\').hide();\n"
        result += "}\n"
        result += "\n})\n\n}"

        return result

    @staticmethod
    def generate_css(css, preview=False):

        result = ""
        tmp = css

        if preview:
            block_name = ".complexhtml_preview"
        else:
            block_name = ".complexhtml_xblock"

        # Prefix all CSS entries with XBlock div name to ensure they apply
        for i in tmp.split('\n'):
            if i.find('{') != -1:
                result += block_name + " " + i
            else:
                result += i
            result += '\n'

        return result

    @XBlock.json_handler
    def get_generated_css(self, data, suffix=''):
        """
        Generate CSS text fo block and return it via AJAX request
        """
        content = {"css": ""}
        if self.body_css != "" and data["block"] != "":
            content["css"] = self.generate_css(self.body_css, true)
            return content
        return content

    @staticmethod
    def generate_dependencies(dependencies):
        """
        Generate HTML tags for JS and CSS dependencies
        """

        css_pile = ""
        js_pile = ""

        # load JS and CSS dependencies
        for line in dependencies.split('\n'):

            if line[:4] == "http":

                if line[-4:] == ".css":
                    css_pile += "<link rel=\"stylesheet\" href=\"" + line + "\" />\n"

                if line[-3:] == ".js":
                    js_pile += "<script src=\"" + line + "\"></script>\n"

                # else ignore; not a valid asset

            # else ignore; not a valid link

        return css_pile + js_pile

    @XBlock.json_handler
    def get_generated_dependencies(self, data, suffix=''):
        """
        Generate HTML tags for JS and CSS dependencies and return them via AJAX request
        """
        content = {"dependencies": ""}
        if self.dependencies != "":
            content["dependencies"] = self.generate_dependencies(self.dependencies)
            return content
        return content

    def student_view(self, context=None):
        """
        The student view
        """

        fragment = Fragment()
        content = {'self': self}
        
        if self.settings_student == "":
            self.settings_student = self.body_json

        body_html = self.generate_dependencies(self.dependencies) + unicode(self.generate_html(self.body_html))

        fragment.add_css(unicode(self.generate_css(self.body_css)))
        fragment.add_css(load_resource('static/css/complexhtml.css'))

        fragment.add_content(Template(body_html).render(Context(content)))
        fragment.add_content(render_template('templates/complexhtml.html', content))

        record = []

        if self.record_click:
            record.append("click")
        if self.record_hover:
            record.append("hover")

        fragment.add_javascript(unicode(
            self.generate_js(
                self.body_js_chunk_1,
                self.body_js_chunk_2,
                self.body_tracked,
                record
            )
        ))
        fragment.initialize_js('ComplexHTMLXBlock')

        return fragment

    def studio_view(self, context=None):
        """
        The studio view
        """

        fragment = Fragment()

        # Load CodeMirror
        fragment.add_javascript(load_resource('static/js/codemirror/lib/codemirror.js'))
        fragment.add_javascript(load_resource('static/js/codemirror/mode/xml/xml.js'))
        fragment.add_javascript(load_resource('static/js/codemirror/mode/htmlmixed/htmlmixed.js'))
        fragment.add_javascript(load_resource('static/js/codemirror/mode/javascript/javascript.js'))
        fragment.add_javascript(load_resource('static/js/codemirror/mode/css/css.js'))
        fragment.add_css(load_resource('static/js/codemirror/lib/codemirror.css'))

        # Load CodeMirror add-ons
        fragment.add_css(load_resource('static/js/codemirror/theme/mdn-like.css'))
        fragment.add_javascript(load_resource('static/js/codemirror/addon/edit/matchbrackets.js'))
        fragment.add_javascript(load_resource('static/js/codemirror/addon/edit/closebrackets.js'))
        fragment.add_javascript(load_resource('static/js/codemirror/addon/search/search.js'))
        fragment.add_javascript(load_resource('static/js/codemirror/addon/search/searchcursor.js'))
        fragment.add_javascript(load_resource('static/js/codemirror/addon/dialog/dialog.js'))
        fragment.add_css(load_resource('static/js/codemirror/addon/dialog/dialog.css'))

        # Load Studio View
        fragment.add_content(render_template('templates/complexhtml_edit.html', {'self': self}))
        fragment.add_css(load_resource('static/css/complexhtml_edit.css'))
        fragment.add_javascript(load_resource('static/js/complexhtml_edit.js'))
        fragment.initialize_js('ComplexHTMLXBlockStudio')

        return fragment

    @staticmethod
    def generate_preview(self, dependencies, html, json, jsa, jsb, css):

        preview = ""

        # disabled for now due to time constraints

        #preview += self.generate_dependencies(dependencies)

        # style tag

        #preview += self.generate_css(css, True)

        # style tag

        # script tag

        # json_settings = { contents of json from arguments }

        # jsa

        # function preview_run() {
        #   jsb
        # };

        # script tag

        # ".complexhtml_preview" div

        #preview += self.generate_html(html)

        # ".complexhtml_preview" div

        return preview

    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):
        """
        Course author pressed the Save button in Studio
        """

        result = {"submitted": "false", "saved": "false", "message": "", "preview": ""}

        if len(data) > 0:

            if data["commit"] == "true":

                # NOTE: No validation going on here; be careful with your code
                self.display_name = data["display_name"]
                self.record_click = data["record_click"] == 1
                self.record_hover = data["record_hover"] == 1
                self.dependencies = data["dependencies"]
                self.body_html = data["body_html"]
                self.body_tracked = data["body_tracked"]
                self.body_json = data["body_json"]
                self.body_js_chunk_1 = data["body_js_chunk_1"]
                self.body_js_chunk_2 = data["body_js_chunk_2"]
                self.body_css = data["body_css"]

                result["submitted"] = "true"
                result["saved"] = "true"

            elif data["commit"] == "false":

                result["submitted"] = "true"
                result["preview"] = self.generate_preview(
                    self,
                    data["dependencies"],
                    data["body_html"],
                    data["body_json"],
                    data["body_js_chunk_1"],
                    data["body_js_chunk_2"],
                    data["body_css"]
                )

            else:
                print("Invalid commit flag. Not doing anything.")

        return result

    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("complexhtml",
             """<vertical_demo>
                <complexhtml/>
                </vertical_demo>
             """),
        ]