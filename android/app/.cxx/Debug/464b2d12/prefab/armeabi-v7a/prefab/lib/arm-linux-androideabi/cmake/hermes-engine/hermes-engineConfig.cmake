if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/Users/macbookprom1/.gradle/caches/9.0.0/transforms/e2a65b68f7e0200d7012676f338f38b6/transformed/hermes-android-0.14.0-debug/prefab/modules/hermesvm/libs/android.armeabi-v7a/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/macbookprom1/.gradle/caches/9.0.0/transforms/e2a65b68f7e0200d7012676f338f38b6/transformed/hermes-android-0.14.0-debug/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

