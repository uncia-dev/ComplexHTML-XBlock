# ComplexHTML XBlock for the Open edX Platform

### Description

ComplexHTML is an XBlock module for edX that runs on the fullstack and devstack versions. It permits a course author to write HTML, CSS, JavaScript and JSON code in the Studio view, all of which is compiled into a slide for student viewing. In addition, the course author can set this module to record student interactions.

This module was meant to be used in conjunction with a JavaScript library for a customized edX course, however it is available for everyone, and hopefully it will be of use to others. The text areas in the Studio Editor make use of CodeMirror, however the HTML text area also supports CKEditor, in case you prefer a WYSIWYG editor. Just note that CKEditor will have to be installed separately and a URL to it will be required. Please also note that there is no validation for any code you write in the Studio view.

ComplexHTML was created by Raymond Blaga for the edX Aviation Project at Seneca College's Centre for Development of Open Technology. Licensing wise, feel free to use and change this code as you wish.

### Installation & Usage Guide

* First ensure that advanced modules are enabled on your edX server. See here: http://edx-developer-guide.readthedocs.org/en/latest/extending_platform/xblocks.html#testing

* SSH into your edX server and enter the following commands, and download the module from GitHub:

    `git clone https://github.com/uw-ray/ComplexHTML-XBlock.git`

* (Optional) Enable CKEditor support. Edit "complexhtml/complexhtml/static/js/complexhtml_edit.js" and search for "CKEditor_URL". Set the field to the location of "ckeditor.js", either hosted by your web server (ie Apache) or CKEditor's CDN.

![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_01.jpg)
  
* Install the XBlock:

    `sudo -u edxapp /edx/bin/pip.edxapp install <path to XBlock parent directory>/ComplexHTML-XBlock/`
    
![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_02.jpg)
  
* In the edX Studio, open your course and navigate to Settings -> Advanced Settings. Look at the "Advanced Module List" and add "complexhtml" to the list. Click on "Save Changes". 

![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_03.jpg)

* Open your course as you would when adding units and click on the "Advanced" button at the bottom of the screen:

![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_04.jpg)

* In the menu, click on "ComplexHTML XBlock":

![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_05.jpg)

* By default, the XBlock only has a sample paragraph, so you will have to click the Edit button:

![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_06.jpg)

* There are five tabs for this module: Options, Preview, HTML, JavaScript, CSS. In Options, you can set the title of the slide, which will be seen by the students in the LMS. Other options may be added in the future.

![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_07.jpg)

* The second tab allows you to create a web page within Studio. The example below show CKEditor in action:

![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_08.jpg)

* You can also write a list of HTML elements that you wish to track, when the student clicks on them; other events might be implemented in the future. In this list, either type in the tagname without brackets (ie "p"; optionally there is a second parameter for type, in case you deal with input tags; ie "input, button"), or a class or id (preceded by "." or "#"):

![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_09.jpg)

* A note on the recorded interaction: it is recorded in a student-specific field called grabbed_data, with the pattern below. In the back end, messages will also be displayed for every interaction.

    `(time, [id, recorded_action])`

![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_15.jpg)

* The third tab is the JavaScript Editor. The code that you type in here will run when a student views the module in LMS:

![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_10.jpg)

* Optionally, there is also a JSON editor that will store whatever default settings you wish to attach to your JavaScript code above. This JSON code will be stored for every student as well, in case you wish to have student-specific settings. To access these settings in your JavaScript code, simply call "json_settings". It is parsed and ready for use:

![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_11.jpg)

* Lastly there is the CSS editor. Make sure selector is on the same line as the opening accolade. For example:

    ```
    .this_is_a_selector {
        color: red;
    }
    ```
    
![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_12.jpg)

* Now you can either save your work, or check it out in the Preview pane. Note that tracking features are disabled in the preview mode:

![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_13.jpg)

* (Optional) If you want to see some useful debug code in the Student view, open your browser's console and type: 

    `$(".dev_stuff").show()`
    
* There is also a Fullscreen button, which fills up the entire browser window with the Studio View. Note that the implementation is a bit troublesome on screens smaller than 1920x1080.

![Image](https://raw.githubusercontent.com/uw-ray/ComplexHTML-XBlock/master/docs/chx_14.jpg)
