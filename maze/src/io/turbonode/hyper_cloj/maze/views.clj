(ns io.turbonode.hyper-cloj.maze.views
  (:use [clojure.string :only (split)])
  (:require [io.turbonode.hyper-cloj.maze.data :as data]
            [io.turbonode.hyper-cloj.maze.templates :as templates]
            [net.cgrand.enlive-html :as h]))

(defn xml-content [body]
  {:headers {"Content-Type" "application/xml"}
   :body (str "<?xml version=\"1.0\" ?>"
              body)})

(declare filler remover)

(defn collection []
  (xml-content (-> templates/collection
                   (h/sniptest [:collection]
                               (h/set-attr :href "/maze/"))
                   (h/sniptest [:link]
                               (h/clone-for [m (data/all-mazes)]
                                 (h/set-attr :href (str "/maze/" (:id m) "/")))))))
(defn item [maze]
  (when (data/get-maze maze)
    (xml-content (-> templates/item
                     (h/sniptest [:item]
                                 (h/set-attr :href (str "/maze/" maze "/")))
                     (h/sniptest [[:link (h/attr= :rel "start")]]
                                 (h/set-attr :href (str "/maze/" maze "/0:north")))
                     (h/sniptest [[:link (h/attr= :rel "collection")]]
                                 (h/set-attr :href "/maze/"))))))

(defn cell [maze cell]
  (when-let [maze-data (data/get-maze maze)]
    (let [index (first (split cell #":"))]
      (when-let [sides (data/get-cell maze-data (str "cell" index))]
        (let [total (count (:cells maze-data))
              sqrt (int (Math/sqrt total))
              index (Integer/parseInt index)
              exit (= index (- total 1))
              neighbors (vector (- index 1)
                                (+ index (* sqrt -1))
                                (+ index 1)
                                (+ index sqrt))
              triples (map vector ["north" "west" "south" "east"]
                                  sides
                                  neighbors)
              doors (map #(mapv % [0 2])
                         (filter #(zero? (% 1)) triples))
              walls (map #(% 0)
                         (filter #((complement zero?) (% 1)) triples))
              walls (if (true? exit) walls (conj walls "exit"))]
          (xml-content (-> templates/cell
                           (h/sniptest [:cell]
                                       (h/do->
                                         (h/set-attr :href (str "/maze/" maze "/" cell))
                                         (h/set-attr :rel "current")))
                           (filler doors maze exit)
                           (remover (conj walls "start"))
                           (h/sniptest [[:link (h/attr= :rel "maze")]]
                                       (h/set-attr :href (str "/maze/" maze "/")))
                           (h/sniptest [[:link (h/attr= :rel "collection")]]
                                       (h/set-attr :href "/maze/")))))))))

(defn exit [maze]
  (when (data/get-maze maze)
    (xml-content (-> templates/cell
                     (h/sniptest [:cell]
                                 (h/do->
                                   (h/set-attr :href (str "/maze/" maze "/999"))
                                   (h/set-attr :rel "exit")))
                     (h/sniptest [[:link (h/attr= :rel "start")]]
                                 (h/set-attr :href (str "/maze/" maze "/0:north")))
                     (h/sniptest [[:link (h/attr= :rel "maze")]]
                                 (h/set-attr :href (str "/maze/" maze "/")))
                     (h/sniptest [[:link (h/attr= :rel "collection")]]
                                 (h/set-attr :href "/maze/"))
                     (remover ["north" "west" "south" "east" "exit"])))))

(defn- filler [snip values maze exit]
  (let [snip (if (true? exit)
               (h/sniptest snip
                           [[:link (h/attr= :rel "exit")]]
                           (h/set-attr :href
                                       (str "/maze/" maze "/999")))
               snip)]
    (reduce (fn [snip v]
              (h/sniptest snip
                          [[:link (h/attr= :rel (v 0))]]
                          (h/set-attr :href
                                      (str "/maze/" maze "/" (str (v 1) ":" (v 0))))))
            snip values)))

(defn- remover [snip values]
  (reduce (fn [snip v]
            (h/sniptest snip
                        [[:link (h/attr= :rel v)]]
                        nil))
          snip values))
