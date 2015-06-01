# cdot_slides_for_edx XBlock

### Description

Created by Raymond Blaga for the edX Aviation Project at Seneca College's Centre for Development of Open Technology.

This XBlock is a component for the edX platform and can be installed on devstakcblac and fullstack. It permits a course author to write made HTML, CSS, JavaScript and JSON code in the Studio view, all of which is compiled into a slide for student viewing. Unlike edX's built-in HTML module, this XBlock can also record student interactions within the slide, for later analysis.

This module is meant to be used in conjunction with CDOT's JavaScript library for a customized edX course, however it is available for others, should they have interest in it.




### Installation

First ensure that advanced modules are enabled on your edX server. See here: http://edx-developer-guide.readthedocs.org/en/latest/extending_platform/xblocks.html

SSH into your edX server and enter the following commands, and download the module from GitHub:
  git clone https://github.com/uw-ray/cdot_slides_for_edx.git

(Optional) Enable CKEditor support. Edit "cdot_slides_for_edx/cdot_slides_for_edx/static/js/cdot_slides_for_edx_studio.js" and search for "CKEditor_URL". Set the field to the location of "ckeditor.js"
  
Install the XBlock:
  sudo -u edxapp /edx/bin/pip.edxapp install cdot_slides_for_edx/
  
In Studio, open your course and navigate to Settings -> Advanced Settings. Look at the advance_modules policy key and add "cdot_slides_for_edx" to the list. Click on "Save changes". (( Picture here ))

(( Picture of how to add unit to course ))

### Usage

Regarding CSS:
assuming course author places the opening accolade on the same line as the selectors
ie the first line for each CSS element should be as follows ".this_is_a_selector {"
