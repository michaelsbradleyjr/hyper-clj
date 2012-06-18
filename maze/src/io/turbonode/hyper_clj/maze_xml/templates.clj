(ns io.turbonode.hyper-clj.maze-xml.templates
  (:use hiccup.core
        hiccup.element
        hiccup.page
        hiccup.bootstrap.page))

(def index
  (html5
    [:head
     [:title "Maze Game"]
     [:meta {:http-equiv "Content-Type" :content "text/html;charset=UTF-8"}]
     (include-js "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js")
     (include-bootstrap)
     (javascript-tag "var CLOSURE_NO_DEPS = true;")
     (include-js "javascripts/maze_xml.js")
     ]
    [:body
     [:div {:class "container" :style "padding-top:25px;"}
     [:h1 "Maze Game"]
     [:div {:id "play-space" :style "width:600px;"}
      [:pre {:id "history" :style "height:200px;overflow:auto;"}]
      [:div {:id "display" :style "padding: .3em;"}
       [:span {:class "prompt"} "You have the following options: &nbsp;"]
       [:span {:class "options" :style "font-weight:bold;font-family:monospace;"}]]
      [:form {:name "interface" :action "#" :method "post" :class "well form-horizontal"}
       [:label "What would you like to do?"]
       [:input {:type "text" :name "move" :value "" :class "input-mediumsearch-query"}]
       [:span " "]
       [:button {:type "submit" :class "btn btn-primary"} "Go"]
       ]]]]))

(defn- wrap-with-maze [els]
  (html [:maze {:version "1.0"}
         els]))

(def collection
  (wrap-with-maze [:collection {:href ""}
                   [:link {:href "" :rel ""}]]))

(def item
  (wrap-with-maze [:item {:href ""}
                   [:link {:href "" :rel "start"}]
                   [:link {:href "" :rel "collection"}]]))

(def cell
  (wrap-with-maze [:cell {:href "" :rel ""}
                   [:link {:href "" :rel "north"}]
                   [:link {:href "" :rel "west"}]
                   [:link {:href "" :rel "south"}]
                   [:link {:href "" :rel "east"}]
                   [:link {:href "" :rel "start"}]
                   [:link {:href "" :rel "exit"}]
                   [:link {:href "" :rel "maze"}]
                   [:link {:href "" :rel "collection"}]]))

(def error
  (wrap-with-maze [:error
                   [:title]
                   [:code]
                   [:message]]))
