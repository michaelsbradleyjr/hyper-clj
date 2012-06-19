(ns io.turbonode.hyper-clj.maze-xml
  (:require [clojure.browser.repl :as repl]
            [clojure.string :as string]
            [jayq.core :as jayq]))

(def $ jayq/$)

(declare attach-events
         get-document
         get-option-link
         maze-media-type
         move
         process-links
         set-focus
         show-options
         sorry-message
         start-link
         success-message
         update-history)

(jayq/document-ready
 (fn []
   (repl/connect "http://localhost:9000/repl")
   (attach-events)
   (get-document start-link)
   (set-focus)))

(defn attach-events []
  (-> ($ "[name|=interface]")
      (jayq/bind :submit (fn [] (move) false))))

(defn get-document [url]
  (jayq/ajax url {:accepts maze-media-type
                  :context js/window
                  :dataType "xml"
                  :success process-links
                  :type "GET"}))

(defn get-option-link [action]
  (when-let [options-elm (first ($ :.options))]
    (let [links (.-links options-elm)]
      (loop [head (first links)
             tail (rest links)]
        (if (= (or (:name head) (:rel head)) action)
          (:href head)
          (when-not (empty? tail)
             (recur (first tail)
                    (rest tail))))))))

(def maze-media-type "application/vnd.amundsen.maze+xml")

(defn move []
  (when-let [move-elm (first ($ "[name|=move]"))]
    (let [v (.-value move-elm)]
      (if (= v "clear")
        (.go js/history 0)
        (let [href (get-option-link v)]
          (if href
            (do (update-history v)
                (get-document href))
            (js/alert sorry-message))
          (set-focus))))))

(defn process-links [data]
  (show-options
   (flatten
    (map (fn [node]
           (let [$node ($ node)
                 href (jayq/attr $node :href)
                 rels (string/split (jayq/attr $node :rel) #" ")
                 name (jayq/attr $node :name)]
             (map (fn [rel]
                    {:rel rel :href href :name name}) rels)))
         (jayq/find ($ data) :link)))))

(defn set-focus []
  (doto ($ "[name|=move]")
        (.val "")
        (.focus)))

(defn show-options [links]
  (when-let [options-elm (first ($ ".options"))]
    (set! (.-links options-elm) links)
    (let [txt (map (fn [{:keys [rel href name]}]
                     (cond
                       (= rel "collection") "clear"
                       (= rel "maze") (or name rel)
                       :else rel))
                   links)
          txt (string/join ", " txt)]
      (set! (.-innerHTML options-elm) txt))
    ))

(def sorry-message "Sorry, I don't understand what you want to do.")

(def start-link "/maze/")

(def success-message "Congratulations! you've made it out of the maze!")

(defn update-history [action]
  (when-let [history-elm (first ($ "#history"))]
    (let [num (.-num history-elm)
          num (if num num 0)
          txt (.text ($ history-elm))
          new-entry (fn [entry]
                      (.text ($ history-elm) (str (+ num 1) ": " entry "\n" txt)))]
      (set! (.-num history-elm) (+ num 1))
      (if (= action "exit")
        (new-entry success-message)
        (new-entry action)))))
