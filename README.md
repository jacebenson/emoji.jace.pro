This is a 11ty site.  it will be a alternative to emojipedia or the unicode emoji site.

it wont have  ablob but rather will build its pages based on the data found in the following endpoints...


https://unicode.org/Public/emoji/latest/emoji-test.txt

this has all the emoji data we need to build the pages.

it's structured like this;

```
# emoji-test.txt
# Date: 2025-08-04, 20:55:31 GMT
# © 2025 Unicode®, Inc.
# Unicode and the Unicode Logo are registered trademarks of Unicode, Inc. in the U.S. and other countries.
# For terms of use and license, see https://www.unicode.org/terms_of_use.html
#
# Emoji Keyboard/Display Test Data for UTS #51
# Version: 17.0
#
# For documentation and usage, see https://www.unicode.org/reports/tr51
#
# This file provides data for testing which emoji forms should be in keyboards and which should also be displayed/processed.
# Format: code points; status # emoji name
#     Code points — list of one or more hex code points, separated by spaces
#     Status
#       component           — an Emoji_Component,
#                             excluding Regional_Indicator, ASCII, and non-Emoji
#       fully-qualified     — a fully-qualified emoji (see ED-18 in UTS #51),
#                             excluding Emoji_Component
#       minimally-qualified — a minimally-qualified emoji (see ED-18a in UTS #51)
#       unqualified         — an unqualified emoji (see ED-19 in UTS #51)
# Notes:
#   • A mapping of these status values to RGI_Emoji_Qualification property values
#     is given by ED-28 in UTS #51.
#   • This includes the emoji components that need emoji presentation (skin tone and hair)
#     when isolated, but omits the components that need not have an emoji
#     presentation when isolated. See ED-20 in UTS #51 for further information.
#   • The RGI emoji set corresponds to the RGI_Emoji property and contains the same sequences
#     as the union of the sets of component and fully-qualified sequences in this file.
#     See ED-27 in UTS #51 for further information.
#   • The listed minimally-qualified and unqualified cover all cases where an
#     element of the RGI set is missing one or more emoji presentation selectors.
#   • The file is in CLDR order, not codepoint order. This is recommended (but not required!) for keyboard palettes.
#   • The groups and subgroups are illustrative. See the Emoji Order chart for more information.


# group: Smileys & Emotion

# subgroup: face-smiling
1F600                                                  ; fully-qualified     # 😀 E1.0 grinning face
1F603                                                  ; fully-qualified     # 😃 E0.6 grinning face with big eyes
1F604                                                  ; fully-qualified     # 😄 E0.6 grinning face with smiling eyes
1F601                                                  ; fully-qualified     # 😁 E0.6 beaming face with smiling eyes
1F606                                                  ; fully-qualified     # 😆 E0.6 grinning squinting face
1F605                                                  ; fully-qualified     # 😅 E0.6 grinning face with sweat
1F923                                                  ; fully-qualified     # 🤣 E3.0 rolling on the floor laughing
1F602                                                  ; fully-qualified     # 😂 E0.6 face with tears of joy
1F642                                                  ; fully-qualified     # 🙂 E1.0 slightly smiling face
1F643                                                  ; fully-qualified     # 🙃 E1.0 upside-down face
1FAE0                                                  ; fully-qualified     # 🫠 E14.0 melting face
1F609                                                  ; fully-qualified     # 😉 E0.6 winking face
1F60A                                                  ; fully-qualified     # 😊 E0.6 smiling face with smiling eyes
1F607                                                  ; fully-qualified     # 😇 E1.0 smiling face with halo

# subgroup: face-affection
1F970                                                  ; fully-qualified     # 🥰 E11.0 smiling face with hearts
1F60D                                                  ; fully-qualified     # 😍 E0.6 smiling face with heart-eyes
1F929                                                  ; fully-qualified     # 🤩 E5.0 star-struck
1F618                                                  ; fully-qualified     # 😘 E0.6 face blowing a kiss
1F617                                                  ; fully-qualified     # 😗 E1.0 kissing face
263A FE0F                                              ; fully-qualified     # ☺️ E0.6 smiling face
263A                                                   ; unqualified         # ☺ E0.6 smiling face
1F61A                                                  ; fully-qualified     # 😚 E0.6 kissing face with closed eyes
...
# EOF
```

