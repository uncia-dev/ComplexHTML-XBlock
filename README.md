# cdot_slides_for_edx (Documentation is WIP)

Created by Raymond Blaga for the edX Aviation Project at Seneca College's Centre for Development of Open Technology.

This XBlock is a component for the edX platform and can be installed on devstack and fullstack. It permits a course author to paste in pre-made HTML, CSS, JavaScript and JSON code, all of which is compiled into a slide for student viewing. Unlike edX's built-in HTML module, this XBlock also record student interactions within the slide, for later analysis. By default, only button and link clicks are recorded into the database, but this can be further expanded via AJAX requests (see below).

This module is meant to be used in conjunction with CDOT's library for a customized edX course, however it is available for other developers should they have interest in it. This module is nothing too fancy (Studio View is made up only of handful of textarea elements), but hopefully it will be of use to others.

=====
Needs more documentation
=====


There is also support for CKEditor; edit "cdot_slides_for_edx/cdot_slides_for_edx/static/js/cdot_slides_for_edx_studio.js" and search for "CKEditor_URL". Just note that it will work mostly only for static HTML content (ie no forms and buttons), therefore it is disabled by default.

To install this module, SSH into your edX server and enter the following commands:

  git clone https://github.com/uw-ray/cdot_slides_for_edx.git
  sudo -u edxapp /edx/bin/pip.edxapp install cdot_slides_for_edx/


Regarding CSS:
# assuming course author places the opening accolade on the same line as the selectors
# ie the first line for each CSS element should be as follows ".this_is_a_selector {"