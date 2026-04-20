if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/Users/macbookprom1/.gradle/caches/9.0.0/transforms/cbdb5ebe68f88c6ca5f241edc07a1207/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.x86_64/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/macbookprom1/.gradle/caches/9.0.0/transforms/cbdb5ebe68f88c6ca5f241edc07a1207/transformed/fbjni-0.7.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

