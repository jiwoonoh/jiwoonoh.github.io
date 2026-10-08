#!/bin/bash
set -e
cd "$(dirname "$0")/.."
export JEKYLL_NO_BUNDLER_REQUIRE=true
exec /Users/jiwoo_noh/.rbenv/versions/3.1.2/bin/ruby /usr/local/bin/jekyll serve \
  --config _config.yml,local/dev.yml --host 127.0.0.1 --port 4000
