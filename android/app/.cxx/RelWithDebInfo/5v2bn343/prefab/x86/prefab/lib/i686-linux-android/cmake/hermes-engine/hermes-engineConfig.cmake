if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/Users/macbookprom1/.gradle/caches/9.0.0/transforms/20df13adade8c3a9212775b35877cb99/transformed/hermes-android-0.14.0-release/prefab/modules/hermesvm/libs/android.x86/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/macbookprom1/.gradle/caches/9.0.0/transforms/20df13adade8c3a9212775b35877cb99/transformed/hermes-android-0.14.0-release/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

