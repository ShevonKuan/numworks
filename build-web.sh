
# epsilon

sed -i 's/const char\* Ion::pcbVersion() { return "00.00"; }/const char* Ion::pcbVersion() { return "build by shevon"; }/' ion/src/shared/dummy/platform_info.cpp

sed -i 's/FccId = "FCC ID"/FccId = "Build info"/' apps/shared.universal.i18n

sed -i 's/const char\* Ion::fccId() { return "NA"; }/const char* Ion::fccId() { return "Build by Shevon"; }/' ion/src/shared/dummy/fcc_id.cpp

# # omega
# # omega build failed
# git clone https://github.com/emscripten-core/emsdk.git
# cd emsdk
# ./emsdk install latest-fastcomp
# ./emsdk activate latest-fastcomp
# source emsdk_env.sh


# sed -i 's/return "00.00"/return "build by shevon"/' ion/src/shared/dummy/pcb_version.cpp

# sed -i 's/FccId = "FCC ID"/FccId = "Build info"/' apps/shared.universal.i18n

# sed -i 's/return "NA"/return "Build by Shevon"/' ion/src/shared/dummy/fcc_id.cpp