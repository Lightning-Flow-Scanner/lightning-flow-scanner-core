# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] (master branch content)

- Add your updates here :)

## [v2.27.0] - 2023-12-16

- Expose a method **generateOutputFile** so it can be called from both sfdx plugin & VsCode Extension, with fields:
  - Flow API Name
  - Rule Name
  - Item
  - Severity
  - Rule description
  - Rule Type
  - Flow Type
  - Flow Label