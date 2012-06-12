(ns io.turbonode.hyper-cloj.maze
  (:use compojure.core
        [compojure.route :as route]
        [compojure.handler :as handler]
        [ring.adapter.jetty :only (run-jetty)]
        [ring.middleware.reload :only (wrap-reload)]
        [ring.middleware.refresh :only (wrap-refresh)])
  (:require [io.turbonode.hyper-cloj.maze.templates :as templates]
            [ring.util.response :as response]))

(defroutes app*
  (route/resources "/")
  (GET "/amazing" [] "tubes!")
  (route/not-found "Sorry, there's nothing here."))

(def app (handler/site app*))

(defn -main [& [port]]
  (let [port (Integer. (or port (System/getenv "PORT")))]
    (run-jetty (wrap-refresh app)
               {:port port :join? false})))
