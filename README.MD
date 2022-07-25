# DankTimesBot-spongemock
sPoNgEmOcKiFy CoMmAnD fOr DaNkTiMeSbOt.

## Installation
- Git clone this repo into your DankTimesBot/plugins directory.
- Add `spongemock` to your `/data/config.json` file.

`$ git clone https://github.com/lerke/danktimesbot-plugin-spongemock ./plugins/spongemock`
`
{ 
  ...,
  "plugins": [
    ...,
    "spongemock"
  ]
}
`

## Usage
> \> /spongemock some input string
> < SoMe InPuT sTrInG

## Changelog
### 1.1.0
- Refactored code to make it more consistent
    - Photo caption mock also usable by miakomock
    - Sneakymock also usable by miakomock (sneakymiakomock) 
- Changed the commands so they don't overlap: 
    - /spongemock, /sm, /🧽, /spons
    - /miakomock, /mm, /🙏
    - /sneakyspongemock, /ssm, /💨🧽
    - /sneakymiakomock, /smm, /💨🙏

### 1.0.4
- Added miakomock (/miakomock /🙏 /mm)

### 1.0.3
- Added priority to inline text over reply text.
- If there's both inline text and a reply the inline text will be mocked in reply to the same message replied by the user.
- Fixed special characters mapping bug.
- Added _ & - as special characters.
- Added /sneakymock /💨 & /sm. Your message will be deleted after the spongemock.

### 1.0.2
- Added /s & /spons as a shortcut
- Added mock for `(` and `)`

### 1.0.1
- Spongemock now works with DankTimesBot 2.0.0
- Added /🧽 as a shortcut
- Initial case is now randomized. Thanks @rick-mittendorff [for the suggestion](https://github.com/Lerke/DankTimesBot-Plugin-Spongemock/issues/4)
- /spongemock also mocks your punctuation and special characters now. Thanks @MaikoKingma [for the suggestion](https://github.com/Lerke/DankTimesBot-Plugin-Spongemock/issues/2)