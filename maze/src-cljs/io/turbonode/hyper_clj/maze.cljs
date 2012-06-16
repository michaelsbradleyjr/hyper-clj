(ns io.turbonode.hyper-clj.maze
  (:require [clojure.browser.repl :as repl]
            [jayq.core :as jayq]))

(def $ jayq/$)

(declare attach-events get-document set-focus start-link)

(defn init []
  (repl/connect "http://localhost:9000/repl")
  (attach-events)
  (get-document start-link)
  (set-focus)
  )

(jayq/document-ready init)

(defn attach-events []
  (-> ($ "[name|=interface]")
      (jayq/bind :submit (fn []
                           (js/alert "happy dance")
                           false))))

(def start-link "/maze/five-by-five/")

(defn get-document [uri]
  )

(defn set-focus []
  )
