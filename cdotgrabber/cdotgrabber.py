"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
import datetime

from xblock.core import XBlock
from xblock.fields import Scope, Integer, List, String
from xblock.fragment import Fragment


class CDOTgrabberXBlock(XBlock):
    """
    Simple XBlock that grabs
    """

    header = String(
        help="Title of the slide",
        default="", scope=Scope.content
    )

    body_html = String(
        help="HTML body of the slide",
        default="", scope=Scope.content
    )

    body_js = String(
        help="JS code for the slide",
        default="", scope=Scope.content
    )

    body_css = String(
        help="CSS code for the slide",
        default="", scope=Scope.content
    )

    grabbed = List(
        default=[], scope=Scope.user_state,
        help="Student interaction that was grabbed from XBlock.",
    )

    def resource_string(self, path):
        """
        Handy helper for getting resources from our kit.
        """
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    @XBlock.json_handler
    def grab_data(self, data, suffix=''):
        """
        Grab all data passed from cdotgrabber.js and append it to self.grabbed.
        """

        content = {"time": str(datetime.datetime.now())}
        chunk = []

        for i in data: chunk.append((str(i), str(data[i])))

        if len(chunk) > 0:
            self.grabbed.append((content["time"], chunk))
            content["data"] = chunk

        else:
            self.grabbed.append((content["time"], "crickets"))
            content["data"] = None

        print "Grabbed data on " + self.grabbed[-1][0]
        for i in self.grabbed[-1][1]: print "+--" + str(i)

        return content

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The student view
        """
        html = self.resource_string("static/html/cdotgrabber.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/cdotgrabber.css"))
        frag.add_javascript(self.resource_string("static/js/cdotgrabber.js"))
        frag.initialize_js('CDOTgrabberXBlock')
        return frag

    def studio_view(self, context=None):
        """
        The studio view
        """

        html = self.resource_string("static/html/cdotgrabber_studio.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/cdotgrabber_studio.css"))
        frag.add_javascript(self.resource_string("static/js/cdotgrabber_studio.js"))
        frag.initialize_js('CDOTgrabberXBlockStudio')
        return frag

    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):

        if len(data) > 0:

            self.header = data["header"]
            self.body_html = data["body_html"]
            self.body_js = data["body_js"]
            self.body_css = data["body_css"]

            print("+ Submitted data")
            print("+- Title: " + data["title"])
            print("+- HTML: " + data["body_html"])
            print("+- JS: " + data["body_js"])
            print("+- CSS: " + data["body_css"])

        content = {

            "title": self.title,
            "body_html": self.body_html,
            "body_js": self.body_js,
            "body_css": self.body_css

        }

        return content

    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("CDOTgrabberXBlock",
             """<vertical_demo>
                <cdotgrabber/>
                </vertical_demo>
             """),
        ]
