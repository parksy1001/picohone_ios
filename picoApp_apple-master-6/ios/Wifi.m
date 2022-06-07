//
//  Wifi.m
//  picoApp_apple
//
//  Created by indid on 2022/06/07.
//
#import <NetworkExtension/NetworkExtension.h>
#import "Wifi.h"

@implementation Wifi

RCT_EXPORT_MODULE();

// wifi 보안상태를 가져옴 (0: public wifi, 그 외: private wifi)
RCT_REMAP_METHOD(getWifiSecurityType,
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (@available(iOS 15.0, *)) {
        [NEHotspotNetwork fetchCurrentWithCompletionHandler:^(NEHotspotNetwork * _Nullable currentNetwork) {
            NEHotspotNetworkSecurityType isSecure = [currentNetwork securityType];
            resolve(@(isSecure));
        }];
    }
    else {
      reject(nil, @"not iOS 15", nil);
    }
}

@end
