(defproject io.turbonode.hyper-cloj/maze "0.1.0-SNAPSHOT"
  :description "Maze Game"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :url "https://github.com/michaelsbradleyjr/hyper-cloj/tree/master/maze"
  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
  :cljsbuild {
              :builds [{:source-path "src-cljs"
                        :compiler {:output-to "resources/public/javascripts/maze.js"
                                   :optimizations :whitespace
                                   :pretty-print true}}]}
  :dependencies [[com.ashafa/clutch "0.4.0-SNAPSHOT"]
                 [compojure "1.1.0"]
                 [domina "1.0.0-beta4"]
                 [enlive "1.0.1"]
                 [hiccup "1.0.0"]
                 [hiccup-bootstrap "0.1.0"]
                 [org.clojure/clojure "1.4.0"]
                 [org.clojure/clojurescript "0.0-1236"]
                 [ring "1.1.0"]
                 [ring-refresh "0.1.0"]
                 [swank-clojure "1.4.2"]]
  :plugins [[lein-cljsbuild "0.2.1"]]
  :ring {:handler io.turbonode.hyper-cloj.maze/app
         :auto-refresh? true})
