(ns io.turbonode.hyper-clj.maze.templates
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
     ]
    [:body
     [:h1 "Maze Game"]
     [:div {:id "play-space"}
      [:div {:id "history"}]
      [:div {:id "display"}
       [:span {:class "prompt"} "You have the following options:"]
       [:span {:class "options"}]]
      [:form {:name "interface" :action "#" :method "post"}
       [:fieldset
        [:legend "What would you like to do"]
        [:input {:type "text" :name "move" :value ""}]
        [:input {:type "submit" :value "Go"}]
        ]]]
     ;; it's important to put the following at the bottom of the
     ;; 'body' section; if placed in the 'head' section, DOM
     ;; ready-timing issues may ensue
     (javascript-tag "var CLOSURE_NO_DEPS = true;")
     (include-js "javascripts/maze.js")
      ]))

(defn- wrap-with-maze [els]
  (html [:maze {:version "1.0"}
         els]))

(def collection
  (wrap-with-maze [:collection {:href ""}
                   [:link {:href ""}]]))

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
