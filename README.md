# cdot_slides_for_edx XBlock

### Description

Created by Raymond Blaga for the edX Aviation Project at Seneca College's Centre for Development of Open Technology.

This XBlock is a component for the edX platform and can be installed on devstakcblac and fullstack. It permits a course author to write made HTML, CSS, JavaScript and JSON code in the Studio view, all of which is compiled into a slide for student viewing. Unlike edX's built-in HTML module, this XBlock can also record student interactions within the slide, for later analysis.

This module is meant to be used in conjunction with CDOT's JavaScript library for a customized edX course, however it is available for everyone, should they have interest in my work. Licensing wise, feel free to use and change this code as you wish.

### Installation

* First ensure that advanced modules are enabled on your edX server. See here: http://edx-developer-guide.readthedocs.org/en/latest/extending_platform/xblocks.html#testing

* SSH into your edX server and enter the following commands, and download the module from GitHub:

    `git clone https://github.com/uw-ray/cdot_slides_for_edx.git`

* (Optional) Enable CKEditor support. Edit "cdot_slides_for_edx/cdot_slides_for_edx/static/js/cdot_slides_for_edx_studio.js" and search for "CKEditor_URL". Set the field to the location of "ckeditor.js"

![Image](https://raw.githubusercontent.com/uw-ray/cdot_slides_for_edx/master/docs/cdot_slide00.jpg)
  
* Install the XBlock:

    `sudo -u edxapp /edx/bin/pip.edxapp install cdot_slides_for_edx/`
  
* In Studio, open your course and navigate to Settings -> Advanced Settings. Look at the "Advanced Module List" and add "cdot_slides_for_edx" to the list. Click on "Save Changes". 

![Image](https://raw.githubusercontent.com/uw-ray/cdot_slides_for_edx/master/docs/cdot_slide01.jpg)


### Usage

* Open your course as you would when adding units and click on the "Advanced" button at the bottom of the screen:

![Image](https://raw.githubusercontent.com/uw-ray/cdot_slides_for_edx/master/docs/cdot_slide02.jpg)

* In the menu, click on "CDOT Slide":

![Image](https://raw.githubusercontent.com/uw-ray/cdot_slides_for_edx/master/docs/cdot_slide03.jpg)

* The XBlock will now open the Studio Editor. Moving the cursor in the greyed out area will maximize the Studio Editor:

![Image](https://raw.githubusercontent.com/uw-ray/cdot_slides_for_edx/master/docs/cdot_slide04.jpg)

* First part is to add a title to the slide, and work on the HTML code, either by CKEditor (WYSIWYG and source) or CodeMirror (only source):

![Image](https://raw.githubusercontent.com/uw-ray/cdot_slides_for_edx/master/docs/cdot_slide05.jpg)

* Next stop is the list of HTML elements you wish to record. Either type in the tagname without brackets (ie "p"; optionally there is a second parameter for type, in case you deal with input tags; ie "input, button"), or a class or id (preceded by "." or "#"):

![Image](https://raw.githubusercontent.com/uw-ray/cdot_slides_for_edx/master/docs/cdot_slide06.jpg)

* Now onto JavaScript. Type in the code as you would in any text editor:

![Image](https://raw.githubusercontent.com/uw-ray/cdot_slides_for_edx/master/docs/cdot_slide07.jpg)

* At this step, write any JSON settings you wish to connect to the JavaScript code above:

![Image](https://raw.githubusercontent.com/uw-ray/cdot_slides_for_edx/master/docs/cdot_slide08.jpg)

* Lastly there is the CSS code. Make sure selector is on the same line as the opening accolade. For example:

    `.this_is_a_selector {`

    `}`

![Image](https://raw.githubusercontent.com/uw-ray/cdot_slides_for_edx/master/docs/cdot_slide09.jpg)

* Click on save and admire your slide fully assembled:

![Image](https://raw.githubusercontent.com/uw-ray/cdot_slides_for_edx/master/docs/cdot_slide10.jpg)

* (Optional) If you want to see some useful debug code in the Student view, open your browser's console and type: 

    `$(".dev_stuff").show()`

![Image](https://raw.githubusercontent.com/uw-ray/cdot_slides_for_edx/master/docs/cdot_slide11.jpg)
