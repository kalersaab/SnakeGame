#import "NativeSnakeModuleProvider.h"
#import <ReactCommon/CallInvoker.h>
#import <ReactCommon/TurboModule.h>
#import "NativeSnakeModule.h"

@implementation NativeSnakeModuleProvider

+ (void)load
{
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeSnakeModule>(params.jsInvoker);
}

@end