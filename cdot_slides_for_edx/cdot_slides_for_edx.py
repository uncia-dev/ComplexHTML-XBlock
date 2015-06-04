"""
CDOT Slides for edX XBlock
Author: Raymond Lucian Blaga
Description: An HTML, JavaScript and CSS Editing XBlock that records student interactions if the course author wishes it.
"""

import urllib, datetime, json
from .utils import render_template, load_resource, resource_string
from django.template import Context, Template
from xblock.core import XBlock
from xblock.fields import Scope, Integer, List, String
from xblock.fragment import Fragment

class CDOTSlidesXBlock(XBlock):
    """
    XBlock class
    """

    display_name = String(
        display_name="CDOT Slide",
        help="This name appears in the horizontal navigation at the top of the page",
        scope=Scope.settings,
        default="CDOT Slide"
    )

    body_html = String(
        help="HTML code of the slide",
        default="<p>Body of slide goes here...</p>", scope=Scope.content
    )

    body_tracked = String(
        help="List of elements that are being tracked for student interaction",
        default="p", scope=Scope.content
    )

    body_js = String(
        help="JS code for the slide",
        default="console.log(\"Your lack of JavaScript disturbs me.\");", scope=Scope.content
    )

    body_json = String(
        help="JSON code for the slide used to initialize fields",
        default="{\"blank\": { \"not_really_blank\": \"true\" }}", scope=Scope.content
    )

    body_css = String(
        help="CSS code for the slide",
        default="p { color: red }", scope=Scope.content
    )

    settings_student = String(
        help="Student-specific JSON code for student view",
        default="", scope=Scope.user_state
    )

    grabbed = List(
        help="Student interaction that was grabbed from XBlock.",
        default=[], scope=Scope.user_state
    )

    """
    A handful of getters below
    """

    @XBlock.json_handler
    def get_body_html(self, data, suffix=''):
        return {"body_html": self.body_html}

    @XBlock.json_handler
    def get_body_css(self, data, suffix=''):
        return {"body_css": self.body_css}

    @XBlock.json_handler
    def get_body_js(self, data, suffix=''):
        return {"body_js": self.body_js}

    @XBlock.json_handler
    def get_body_json(self, data, suffix=''):
        return {"body_json": self.body_json}

    @XBlock.json_handler
    def get_settings_student(self, data, suffix=''):
        """
        Return the JSON settings string attached to this XBlock
        """

        # TODO: Remove me
        print self.settings_student

        return {"json_settings": self.settings_student}

    @XBlock.json_handler
    def get_grabbed_data(self, data, suffix=''):
        return {"grabbed_data": self.grabbed}

    def get_time_delta(self):
        """
        :return: Delta between current grabbed input and the previous one. Use to measure time spent between actions.
        """
        return self.grabbed[-1] - self.grabbed[-2]

    @XBlock.json_handler
    def grab_data(self, data, suffix=''):
        """
        Grab all data passed from cdot_slides_for_edx.js and append it to self.grabbed.
        """

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

            # TODO: Remove me
            print self.settings_student

            return {"updated": "true"}

        return {"updated": "false"}

    def student_view(self, context=None):
        """
        The student view
        """

        fragment = Fragment()
        content = {'self': self}
        
        if self.settings_student == "":
            self.settings_student = self.body_json

        # Build page based on user input HTML, JS and CSS code
        if self.body_html[:4] == "http":
            body_html = "<div class=\"cdot_slides_for_edx_xblock\">" + urllib.urlopen(self.body_html).read() + "</div>"
        else:
            body_html = "<div class=\"cdot_slides_for_edx_xblock\">" + self.body_html + "</div>"

        # Build slide specific JavaScript code
        body_js = load_resource('static/js/cdot_slides_for_edx.js')
        tracked = ""

        # Generate AJAX request for each element that will be tracked
        for i in self.body_tracked.split("\n"):
            e = i.split(", ")
            tracked += "recordClick(\'" + e[0] + "\'"
            if len(e) > 1:
                tracked += ", \'" + e[1] + "\'"
            tracked += ");\n"

        body_js = body_js[:-47] + tracked + body_js[-47:]

        if self.body_js[:4] == "http":
            body_js = body_js[:-7] + urllib.urlopen(self.body_js).read() + body_js[-7:]
        else:
            body_js = body_js[:-7] + self.body_js + body_js[-7:]

        if self.body_css[:4] == "http":
            body_css_tmp = urllib.urlopen(self.body_css).read()
        else:
            body_css_tmp = self.body_css

        body_css = ""

        # assuming course author places the opening accolade on the same line as the selectors
        # ie the first line for each CSS element should be as follows ".this_is_a_selector {"
        for i in body_css_tmp.split('\n'):
            if i.find('{') != -1:
                body_css += ".cdot_slides_for_edx_xblock " + i
            else:
                body_css += i
            body_css += '\n'

        fragment.add_content(Template(unicode(body_html)).render(Context(content)))
        fragment.add_javascript(unicode(body_js))
        fragment.add_css(unicode(body_css))
        fragment.add_content(render_template('templates/cdot_slides_for_edx.html', content))
        fragment.add_css(load_resource('static/css/cdot_slides_for_edx.css'))

        fragment.initialize_js('CDOTSlidesXBlock')

        # TODO: Remove me
        print self.settings_student

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
        fragment.add_content(render_template('templates/cdot_slides_for_edx_studio.html', {'self': self}))
        fragment.add_css(load_resource('static/css/cdot_slides_for_edx_studio.css'))
        fragment.add_javascript(load_resource('static/js/cdot_slides_for_edx_studio.js'))
        fragment.initialize_js('CDOTSlidesXBlockStudio')

        return fragment

    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):
        """
        Course author pressed the Save button in Studio
        """

        if len(data) > 0:

            # NOTE: No validation going on here; be careful with your code

            self.display_name = data["display_name"]
            self.body_html = data["body_html"]
            self.body_tracked = data["body_tracked"]
            self.body_json = data["body_json"]
            self.body_js = data["body_js"]
            self.body_css = data["body_css"]

            """ Was used during development
            print("+ Submitted data")
            print("================================================================================")
            print("+- Display Name: " + data["display_name"])
            print("+- HTML: \n" + data["body_html"])
            print("+- Tracked Elements: \n" + data["body_tracked"])
            print("+- JS: \n" + data["body_js"])
            print("+- JSON: \n" + data["body_json"])
            print("+- CSS: \n" + data["body_css"])
            """

            return {"submitted": "true"}

        return {"submitted": "false"}

    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("cdot_slides_for_edx",
             """<vertical_demo>
                <cdot_slides_for_edx/>
                </vertical_demo>
             """),
        ]
