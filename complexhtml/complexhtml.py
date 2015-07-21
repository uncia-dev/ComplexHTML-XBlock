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

    record_clicks = Boolean(
        help="Record student clicks?",
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
    div_title = 'complexhtml_xblock'

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
    def generate_html(self):

        body_html = "<div class=\"" + self.div_title + "\">"
        # Assume valid HTML code
        body_html += self.body_html
        body_html += "</div>"

        return body_html

    @staticmethod
    def generate_js(self):

        # Load first chunk of the JS script
        body_js = load_resource('static/js/complexhtml_lms_chunk_1.js')

        # Generate AJAX request for each element that will be tracked
        tracked = ""

        for i in self.body_tracked.split("\n"):

            if self.record_clicks:
                e = i.split(", ")
                tracked += "recordClick(\'" + e[0] + "\'"
                if len(e) > 1:
                    tracked += ", \'" + e[1] + "\'"
                tracked += ");\n"

            if self.record_hover:
                e = i.split(", ")
                tracked += "recordHover(\'" + e[0] + "\'"
                if len(e) > 1:
                    tracked += ", \'" + e[1] + "\'"
                tracked += ");\n"

        # Adding tracking calls
        body_js += "/* Elements being recorded go here */\n" + tracked

        # add try and catch statements here

        # Add first staff entered chunk - ie the code running before the onLoad
        body_js += "\n/* Staff entered JS code */\n"
        body_js += self.body_js_chunk_1

        # add try and catch statements here

        # Add second staff entered chunk - ie the code running on page load
        body_js += "\n" + load_resource('static/js/complexhtml_lms_chunk_2.js')
        body_js += "\n/* Staff entered JS code */\n"
        body_js += self.body_js_chunk_2
        body_js += "\n})\n\n}"

        return body_js


    @staticmethod
    def generate_css(self):

        body_css = ""
        body_css_tmp = self.body_css

        # Prefix all CSS entries with XBlock div name to ensure they apply
        for i in body_css_tmp.split('\n'):
            if i.find('{') != -1:
                body_css += ".complexhtml_xblock" + " " + i
            else:
                body_css += i
            body_css += '\n'

        return body_css

    @XBlock.json_handler
    def get_generated_css(self, data, suffix=''):
        """
        Generate CSS text fo block and return it via AJAX request
        """
        content = {"css": ""}
        if self.body_css != "" and data["block"] != "":
            content["css"] = self.generate_css(self)
            return content
        return content

    @staticmethod
    def generate_dependencies(self):
        """
        Generate HTML tags for JS and CSS dependencies
        """

        body_html = ""

        # load JS and CSS dependencies
        for line in self.dependencies.split('\n'):

            if line[:4] == "http":

                if line[-4:] == ".css":
                    body_html += "<link rel=\"stylesheet\" href=\"" + line + "\" />"

                if line[-3:] == ".js":
                    body_html += "<script src=\"" + line + "\"></script>"

                # else ignore; not a valid asset

            # else ignore; not a valid link

        return body_html

    def student_view(self, context=None):
        """
        The student view
        """

        fragment = Fragment()
        content = {'self': self}
        
        if self.settings_student == "":
            self.settings_student = self.body_json

        body_html = self.generate_dependencies(self) + unicode(self.generate_html(self))

        fragment.add_css(unicode(self.generate_css(self)))
        fragment.add_css(load_resource('static/css/complexhtml.css'))

        fragment.add_content(Template(body_html).render(Context(content)))
        fragment.add_content(render_template('templates/complexhtml.html', content))

        fragment.add_javascript(unicode(self.generate_js(self)))
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

    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):
        """
        Course author pressed the Save button in Studio
        """

        if len(data) > 0:

            # NOTE: No validation going on here; be careful with your code
            self.display_name = data["display_name"]
            self.record_clicks = data["record_clicks"] == 1
            self.record_hover = data["record_hover"] == 1
            self.dependencies = data["dependencies"]
            self.body_html = data["body_html"]
            self.body_tracked = data["body_tracked"]
            self.body_json = data["body_json"]
            self.body_js_chunk_1 = data["body_js_chunk_1"]
            self.body_js_chunk_2 = data["body_js_chunk_2"]
            self.body_css = data["body_css"]

            return {"submitted": "true"}

        return {"submitted": "false"}

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