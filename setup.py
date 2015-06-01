"""Setup for cdot_slides_for_edx XBlock."""

import os
from setuptools import setup


def package_data(pkg, roots):
    """Generic function to find package_data.

    All of the files under each of the `roots` will be declared as package
    data for package `pkg`.

    """
    data = []
    for root in roots:
        for dirname, _, files in os.walk(os.path.join(pkg, root)):
            for fname in files:
                data.append(os.path.relpath(os.path.join(dirname, fname), pkg))

    return {pkg: data}


setup(
    name='cdot_slides_for_edx-xblock',
    version='1.0',
    description='cdot_slides_for_edx XBlock',
    packages=[
        'cdot_slides_for_edx',
    ],
    install_requires=[
        'XBlock',
    ],
    entry_points={
        'xblock.v1': [
            'cdot_slides_for_edx = cdot_slides_for_edx:CDOTSlidesXBlock',
        ]
    },
    package_data=package_data("cdot_slides_for_edx", ["static", "templates", "public"]),
)
