## fastlane documentation

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios development

```sh
[bundle exec] fastlane ios development
```

Description of what the lane does

### ios ad_hoc

```sh
[bundle exec] fastlane ios ad_hoc
```

### ios sync_devices

```sh
[bundle exec] fastlane ios sync_devices
```

---

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

# 其他开发同步证书(--readonly 必须带上)

fastlane match development --readonly
fastlane match adhoc --readonly
fastlane match appstore --readonly

# 更新证书(development/adhoc/appstore)

fastlane match development
fastlane match adhoc
fastlane match appstore

# 更新描述文件(添加了新设备)

fastlane match development --force_for_new_devices
fastlane match adhoc --force_for_new_devices
