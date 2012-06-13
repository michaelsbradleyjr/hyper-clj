(ns io.turbonode.hyper-cloj.maze.views
  (:require [io.turbonode.hyper-cloj.maze.data :as data]
            [io.turbonode.hyper-cloj.maze.templates :as templates]
            [net.cgrand.enlive-html :as h]))

(defn xml-content [body]
  {:headers {"Content-Type" "application/xml"}
   :body (str "<?xml version=\"1.0\" ?>"
              body)})

(defn collection []
  (xml-content (-> templates/collection
                   (h/sniptest [:collection]
                               (h/set-attr :href "/maze/"))
                   (h/sniptest [:link]
                               (h/clone-for [m (data/all-mazes)]
                                 (h/set-attr :href (str "/maze/" (:id m))))))))

;; (def item []
;;   (xml-content ))