(ns io.turbonode.hyper-cloj.maze.templates
  (:use hiccup.core))

(def collection
  (html [:maze
          [:collection {:href ""}
            [:link {:href ""}]]]))

(def item
  (html [:maze
          [:item {:href ""}
            [:link {:href "" :rel "collection"}]
            [:link {:href "" :rel "start"}]]]))

(def cell
  (html [:maze
          [:cell {:href ""}
            [:link {:href "" :rel "north"}]
            [:link {:href "" :rel "south"}]
            [:link {:href "" :rel "east"}]
            [:link {:href "" :rel "west"}]
            [:link {:href "" :rel "exit"}]
            [:link {:href "" :rel "maze"}]
            [:link {:href "" :rel "collection"}]]]))

(def error
  (html [:maze
          [:error
            [:title]
            [:code]
            [:message]]]))
