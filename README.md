# ComplexHTML XBlock for the Open edX Platform


### Description
------

ComplexHTML is an XBlock module for edX that runs on the fullstack and devstack versions. It permits a course author to write HTML, CSS, JavaScript and JSON code in the Studio view, all of which is compiled into a slide for student viewing. In addition, the course author can set this module to record student interactions.

This module was meant to be used in conjunction with a JavaScript library for a customized edX course, however it is available for everyone, and hopefully it will be of use to others. The text areas in the Studio Editor make use of CodeMirror, however the HTML editor also supports CKEditor, in case you prefer a WYSIWYG editor. Just note that CKEditor will have to be installed separately and a URL to it will be required.

ComplexHTML was created by Raymond Blaga for the edX Aviation Project at Seneca College's Centre for Development of Open Technology. Licensing wise, feel free to use and change this code as you wish.

### Installation Guide
------

1. First ensure that advanced modules are enabled on your edX server. See here: http://edx-developer-guide.readthedocs.org/en/latest/extending_platform/xblocks.html#testing

2. SSH into your edX server, and download this module from GitHub:

    `git clone https://github.com/uw-ray/ComplexHTML-XBlock.git`
    
    (Optional) Enable CKEditor support by editing "complexhtml/static/studio_settings.json". Set the "CKEditor_URL" value to the location of "ckeditor.js", either hosted by your web server (ie Apache) or CKEditor's CDN.
 
3. Install the XBlock:

    `sudo -u edxapp /edx/bin/pip.edxapp install <path to XBlock parent directory>/ComplexHTML-XBlock/`

4. In the edX Studio, open your course and navigate to Settings -> Advanced Settings. Look at the "Advanced Module List" and add "complexhtml" to the list. Click on "Save Changes". 

5. Open your course as you would when adding units and click on the "Advanced" button at the bottom of the screen. From the pop-up menu, select ComplexHTML XBlock"

### Usage Guide
------

ComplexHTML features nine tabs for options and editing:

- Options
- Dependencies
- HTML Editor
- Tracked Elements
- JavaScript (Global)
- JavaScript (Load)
- JSON Settings
- CSS
- Preview


Below is a separate section for each tab.

#### Options Tab

This tab contains the settings for this specific XBlock.

- Display Name - Set the display name for the XBlock, which will be seen in the LMS unit navigation bar
- Record Mouse Click? - Set whether or not to record every student click on trackable elements
- Record Mouse Hover? - Set whether or not to record whenever the student moves the cursor over trackable elements; use with caution, as this will flood the database with data
- Student Ping Interval (ms) - Set, in miliseconds, the interval at which the XBlock tells the server if the student if still viewing the XBlock
- Show Development Info in LMS - Show useful data for development purposes (for now, just the raw fields from the XBlock); note that the page will be huge because of this

#### Dependencies Tab

This tab contains the list of dependencies that the course author wishes to add to their slide. Only URLs to CSS and JS files are accepted; everything else will be discarded.

#### HTML Editor Tab

This tab contains the HTML editor for a slide. By default it is a CodeMirror text field, however, if CKEditor is enabled, the course author will have access to a WYSIWYG interface.

#### Tracked Elements Tab

This tab contains the list of elements that the course author wishes to track when a student clicks on or hover over them. In this list, either type in the tagname without brackets (ie "p"; optionally there is a second parameter for type, in case you deal with input tags; ie "input, button"), or a class or id (preceded by "." or "#").

A note on the recorded interaction: element clicks will be placed in a student-specific field called grabbed_data, with the following pattern: 

`
(time, [id, recorded_action])
`

In the back end, messages will also be displayed for every interaction.

#### JavaScript (Global) Tab

Here, the course author can enter JavaScript code that is executed before the on-load event occurs in LMS for this XBlock (ie the page is fully loaded). This tab is best used for global variables and function declarations. 

This code is validated, and in case it is incorrect, an error message will replace the XBlock's viewing area.

#### JavaScript (Load) Tab

Here, the course author can enter JavaScript code that is executed once the XBlock is fully loaded in LMS. This tab is best used for running the slide JavaScript code. 

This code is validated, and in case it is incorrect, an error message will replace the XBlock's viewing area.

#### JSON Settings Tab

In this tab, the course author can add JSON key and value pairs of data that can be accessed by the JavaScript code in the previous two tabs. The purpose of this feature is to store each student's progress and settings for a slide in an easily accessible object. Each student will have a copy of this object, and it will be changed as the student interacts with the XBlock, and the JavaScript code that the course author wrote.

To access the JSON object in the previous two tabs, use the variable *json_settings*. In other words, you could try *json_settings['setting_name']*.

This code is validated, and in case it is incorrect, an error message will replace the XBlock's viewing area.

#### CSS Tab

Here, the course author can customize their slide's style with CSS. Make sure selector is on the same line as the opening accolade. For example:

    ```
    .this_is_a_selector {
        color: red;
    }
    ```

#### Preview Tab

This is an experimental feature that is currently disabled. If anyone is interesting in further expanding it, there is a lot of partially functional code; it may not currently worked as it was written for an older version of this XBlock.



Once all, or some of the tabs are filled up, just press on Save.



### Other Features & Notes
------

* There is also a Fullscreen button, which fills up the entire browser window with the Studio View. Note that the implementation is a bit troublesome on screens smaller than 1920x1080.

* Here are a few more JavaScript functions that may come in handy

```js
loadSettings()				- Force reload student version of json_settings to json_settings
updateSettings(settings)	- Inject new JSON object to the student settings (ie student-specific copy of json_settings); if settings is blank, just update student settings with json_settings
markCompleted()				- Tell the server that this XBlock was completed by the student
session_start()				- This starts a new student session for this XBlock. Do not call, as it executes on page load.
session_end()				- This ends the current student session for this XBlock. Do not  call, as it executes when the student leaves the page.

```
* To see the development info even if it is hidden, type in the following in the JavaScript console:

`$(".dev_stuff").show()`

* The session system is disabled while running edX Studio, to keep the database clean for the course author
