(ns io.turbonode.hyper-cloj.maze
  (:use [compojure.core :only (GET defroutes)]
        [ring.adapter.jetty :only (run-jetty)])
  (:require (compojure handler route)
            [ring.util.response :as response]))

(defroutes app*
  (compojure.route/not-found "Sorry, there's nothing here."))

(def app (compojure.handler/api app*))

;; ; To run locally:
;; (def server (run-jetty #'app {:port 4242 :join? false}))
