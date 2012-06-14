(ns io.turbonode.hyper-cloj.maze.templates
  (:use hiccup.core))

(defn wrap [els]
  (html [:maze {:version "1.0"}
         els]))

(def collection
  (wrap [:collection {:href ""}
           [:link {:href ""}]]))

(def item
  (wrap [:item {:href ""}
           [:link {:href "" :rel "start"}]
           [:link {:href "" :rel "collection"}]]))

(def cell
  (wrap [:cell {:href "" :rel ""}
           [:link {:href "" :rel "north"}]
           [:link {:href "" :rel "west"}]
           [:link {:href "" :rel "south"}]
           [:link {:href "" :rel "east"}]
           [:link {:href "" :rel "start"}]
           [:link {:href "" :rel "exit"}]
           [:link {:href "" :rel "maze"}]
           [:link {:href "" :rel "collection"}]]))

(def error
  (wrap [:error
           [:title]
           [:code]
           [:message]]))
