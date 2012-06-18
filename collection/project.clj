(defproject io.turbonode.hyper-clj/collection-json "0.1.0-SNAPSHOT"
  :description "Collection+JSON"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :url "https://github.com/michaelsbradleyjr/hyper-clj/tree/master/collection"

  :cljsbuild {
              :builds [{:source-path "src-cljs"
                        :compiler {:output-to "resources/public/javascripts/collection_json.js"
                                   :optimizations :whitespace
                                   :pretty-print true}}]}
  :dependencies [[cheshire "4.0.0"]
                 [com.ashafa/clutch "0.4.0-SNAPSHOT"]
                 [compojure "1.1.0"]
                 [enlive "1.0.1"]
                 [hiccup "1.0.0"]
                 [hiccup-bootstrap "0.1.0"]
                 [jayq "0.1.0-alpha4"]
                 [org.clojure/clojure "1.4.0"]
                 [ring "1.1.0"]
                 [ring-refresh "0.1.0"]
                 [swank-clojure "1.4.2"]]
  :plugins [[lein-cljsbuild "0.2.1"]]
  :ring {:handler io.turbonode.hyper-clj.collection-json/app
         :auto-refresh? true})
