(ns io.turbonode.hyper-cloj.maze
  (:use compojure.core
        [compojure.route :as route]
        [compojure.handler :as handler]
        [ring.adapter.jetty :only (run-jetty)])
  (:require [io.turbonode.hyper-cloj.maze.views :as views]
            [swank.swank]))

;; for development only
(defonce swankify
  (swank.swank/start-server :port 4005))
;; would prefer `lein swank` to embedding swank.swank here, but
;; also want to use `lein ring ...` and can't (yet) compose those
;; tasks, i.e. so they take effect in the same process

(defroutes app*
  (route/resources "/")
  (GET "/maze/" [] (#'views/collection))
  (route/not-found "Sorry, there's nothing here."))

(def app (handler/site #'app*))

(defn -main [& [port]]
  (let [port (Integer. (or port (System/getenv "PORT")))]
    (run-jetty #'app
               {:port port :join? false})))
