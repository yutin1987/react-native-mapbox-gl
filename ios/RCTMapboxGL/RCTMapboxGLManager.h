//
//  RCTMapboxGLManager.h
//  RCTMapboxGL
//
//  Created by Bobby Sudekum on 4/30/15.
//  Copyright (c) 2015 Mapbox. All rights reserved.
//

#import "RCTViewManager.h"

@interface RCTMapboxGLManager : RCTViewManager {
    BOOL _hasInitialized;
    NSMutableSet * _recentPacks;
    NSMutableSet * _throttledPacks;
    NSMutableArray * _packRequests;
}
@end