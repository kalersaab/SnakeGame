require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name           = package["name"]
  s.version        = package["version"]
  s.summary        = package["description"]
  s.license        = package["license"]
  s.author         = package["author"]
  s.homepage       = package["homepage"]
  s.platform       = :ios, "12.0"
  s.source         = { :path => "." }
  s.source_files   = "**/*.{h,mm,cpp}"
  s.public_header_files = "*.h"
  
  s.xcconfig = {
    'HEADER_SEARCH_PATHS' => [
      "$(SRCROOT)/../../ios/build/generated/ios/ReactCodegen",
      "$(SRCROOT)/../../node_modules/@react-native/codegen/lib",
      "$(SRCROOT)/../../node_modules/react-native/React",
      "$(SRCROOT)/../../node_modules/react-native/ReactCommon",
      "$(SRCROOT)/../../node_modules/react-native-codegen/lib",
    ].join(" ")
  }
  
  s.compiler_flags = "-fno-objc-arc"
  s.dependency "React-Core"
  s.dependency "React-cxxreact"
  s.dependency "ReactCommon/turbomodule/core"
end
