;test-check call-by-expr title,expr,r "Testing ~s\n" r===expr()||"Failed: ~a~%Expected: ~a~%Computed: ~a~%"

(define a-and-b
  (conj 
   (call/fresh (lambda (a) (== a 7)))
   (call/fresh 
    (lambda (b) 
      (disj
       (== b 5)
       (== b 6))))))

(define fives
  (lambda (x)
    (disj
     (== x 5)      
     (lambda (a/c)
       (lambda ()
         ((fives x) a/c))))))

(define appendo
  (lambda (l s out)
    (disj
     (conj (== '() l) (== s out))
     (call/fresh
      (lambda (a)
        (call/fresh
         (lambda (d)
           (conj
            (== `(,a . ,d) l)
            (call/fresh
             (lambda (res)
               (conj
                (== `(,a . ,res) out)
                (lambda (s/c)
                  (lambda ()
                    ((appendo d s res) s/c))))))))))))))

(define appendo2
  (lambda (l s out)
    (disj
     (conj (== '() l) (== s out))
     (call/fresh
      (lambda (a)
        (call/fresh
         (lambda (d)
           (conj
            (== `(,a . ,d) l)
            (call/fresh
             (lambda (res)
               (conj
                (lambda (s/c)
                  (lambda ()
                    ((appendo2 d s res) s/c)))
                (== `(,a . ,res) out))))))))))))

(define call-appendo
  (call/fresh
   (lambda (q)
     (call/fresh
      (lambda (l)
        (call/fresh
         (lambda (s)
           (call/fresh
            (lambda (out)
              (conj
               (appendo l s out)
               (== `(,l ,s ,out) q)))))))))))

(define call-appendo2
  (call/fresh
   (lambda (q)
     (call/fresh
      (lambda (l)
        (call/fresh
         (lambda (s)
           (call/fresh
            (lambda (out)
              (conj
               (appendo2 l s out)
               (== `(,l ,s ,out) q)))))))))))

(define call-appendo3
  (call/fresh
   (lambda (q)
     (call/fresh
      (lambda (l)
        (call/fresh
         (lambda (s)
           (call/fresh
            (lambda (out)
              (conj
               (== `(,l ,s ,out) q)
               (appendo l s out)))))))))))

(define ground-appendo (appendo '(a) '(b) '(a b)))

(define ground-appendo2  (appendo2 '(a) '(b) '(a b)))

(define relo
  (lambda (x)
    (call/fresh
     (lambda (x1)
       (call/fresh
        (lambda (x2)
          (conj
           (== x `(,x1 . ,x2))
           (disj
            (== x1 x2)
            (lambda (s/c)
              (lambda () ((relo x) s/c)))))))))))

(define many-non-ans
  (call/fresh
   (lambda (x)
     (disj
      (relo `(5 . 6))
      (== x 3)))))


(test-check "second-set t1"
  (let (($ ((call/fresh (lambda (q) (== q 5))) empty-state)))
    (car $))
  '(((#(0) . 5)) . 1))

(test-check "second-set t2"
  (let (($ ((call/fresh (lambda (q) (== q 5))) empty-state)))
    (cdr $))
  '())

(test-check "second-set t3"
  (let (($ (a-and-b empty-state)))
    (car $))
  '(((#(1) . 5) (#(0) . 7)) . 2))

(test-check "second-set t3, take"
  (let (($ (a-and-b empty-state)))
    (take 1 $))
  '((((#(1) . 5) (#(0) . 7)) . 2)))

(test-check "second-set t4"
  (let (($ (a-and-b empty-state)))
    (car (cdr $)))
  '(((#(1) . 6) (#(0) . 7)) . 2))

(test-check "second-set t5"
  (let (($ (a-and-b empty-state)))
    (cdr (cdr $)))
  '())

(test-check "who cares"
  (let (($ ((call/fresh (lambda (q) (fives q))) empty-state)))
    (take 1 $))
  '((((#(0) . 5)) . 1)))

(test-check "take 2 a-and-b stream"
  (let (($ (a-and-b empty-state)))
    (take 2 $))
  '((((#(1) . 5) (#(0) . 7)) . 2)
    (((#(1) . 6) (#(0) . 7)) . 2)))

(test-check "take-all a-and-b stream"
  (let (($ (a-and-b empty-state)))
    (take-all $))
  '((((#(1) . 5) (#(0) . 7)) . 2)
    (((#(1) . 6) (#(0) . 7)) . 2)))

(test-check "ground appendo"
  (car ((ground-appendo empty-state)))
  '(((#(2) b) (#(1)) (#(0) . a)) . 3))

(test-check "ground appendo2"
  (car ((ground-appendo2 empty-state)))
  '(((#(2) b) (#(1)) (#(0) . a)) . 3))

(test-check "appendo"
  (take 2 (call-appendo empty-state))
  '((((#(0) #(1) #(2) #(3)) (#(2) . #(3)) (#(1))) . 4)
    (((#(0) #(1) #(2) #(3)) (#(2) . #(6)) (#(5)) (#(3) #(4) . #(6)) (#(1) #(4) . #(5))) . 7)))

(test-check "appendo2"
  (take 2 (call-appendo2 empty-state))
  '((((#(0) #(1) #(2) #(3)) (#(2) . #(3)) (#(1))) . 4) (((#(0) #(1) #(2) #(3)) (#(3) #(4) . #(6)) (#(2) . #(6)) (#(5)) (#(1) #(4) . #(5))) . 7)))

(test-check "reify-1st across appendo"
  (map reify-1st (take 2 (call-appendo empty-state)))
  '((() _.0 _.0) ((_.0) _.1 (_.0 . _.1))))

(test-check "reify-1st across appendo2"
  (map reify-1st (take 2 (call-appendo2 empty-state)))
  '((() _.0 _.0) ((_.0) _.1 (_.0 . _.1))))

(test-check "many non-ans"
  (take 1 (many-non-ans empty-state))
  '((((#(0) . 3)) . 1)))