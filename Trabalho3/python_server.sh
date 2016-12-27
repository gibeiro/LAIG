ret=`python -c 'import sys; print("%i" % (sys.hexversion<0x03000000))'`
if [ $ret -eq 0 ]; then
    python -m http.server 8000
else 
    python -m SimpleHTTPServer 8000
fi
