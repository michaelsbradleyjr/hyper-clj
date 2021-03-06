(ns io.turbonode.hyper-clj.maze-xml.data
  (:require [com.ashafa.clutch :as clutch]))

(def mazes-db
  (clutch/get-database "mazes"))

(defn all-mazes []
  (filter (fn [m]
            (not= (:id m) "_design/example"))
          (clutch/all-documents mazes-db)))

(defn get-maze [maze]
  (clutch/get-document mazes-db maze))

(defn get-cell [maze cell]
  ((keyword cell) (:cells (if (string? maze)
                            (get-maze maze)
                            maze))))

(defonce five-by-five
  (let [five-by-five (clutch/get-document mazes-db "five-by-five")]
    (if five-by-five
      five-by-five
      (clutch/put-document mazes-db
                           {:_id "five-by-five"
                            :cells {:cell0  [1 1 1 0]
                                    :cell1  [1 1 1 0]
                                    :cell2  [1 1 0 0]
                                    :cell3  [0 1 0 1]
                                    :cell4  [0 1 1 0]
                                    :cell5  [1 0 1 0]
                                    :cell6  [1 0 0 1]
                                    :cell7  [0 0 1 0]
                                    :cell8  [1 1 0 0]
                                    :cell9  [0 0 1 1]
                                    :cell10 [1 0 0 1]
                                    :cell11 [0 1 1 0]
                                    :cell12 [1 0 1 1]
                                    :cell13 [1 0 0 1]
                                    :cell14 [0 1 1 0]
                                    :cell15 [1 1 1 0]
                                    :cell16 [1 0 1 0]
                                    :cell17 [1 1 0 0]
                                    :cell18 [0 1 0 1]
                                    :cell19 [0 0 1 0]
                                    :cell20 [1 0 0 1]
                                    :cell21 [0 0 0 1]
                                    :cell22 [0 0 1 1]
                                    :cell23 [1 1 0 1]
                                    :cell24 [0 0 1 1]}}))))

(defonce design-example
  (let [design-example (clutch/get-document mazes-db "_design/example")]
    (if design-example
      design-example
      (clutch/put-document mazes-db
                           {:_id "_design/example"
                            :views {:foo
                                    {:map "function (doc) {
                                             emit('cells', doc.cells) }"}}
                            :shows {:cells "function (doc, req) {
                                              return {
                                                body: JSON.stringify(doc.cells),
                                                headers: {
                                                  'content-type': 'application/json'
                                                 }
                                              }}"}
                            :validate_doc_update "function (newDoc, oldDoc, userCtx) {
                                                    throw {
                                                      forbidden: 'read-only'
                                                    }}"}))))
