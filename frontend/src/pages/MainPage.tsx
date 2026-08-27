import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ReceiptText, X } from "lucide-react";
import loadingAnimation from "../assets/klima-loading.svg";

import "../index.css";
import { supabase } from "../../utils/supabase";
// import { supabase } from "../hooks/";

import { Rating } from "../assets/ui/Review";
import useIsMobile from "../hooks/useIsMobile";

// type Product = {
//   id: number;
//   name: string;
//   category: string;
//   price: number;
//   description: string;
//   image: string;
//   x: number;
//   y: number;
// };

// const heroImage = "/klima.png";

interface Topic {
  id: string;
  cover_img?: string;
  logo_img?: string;
  primary_color?: string;
  secondary_color?: string;
  products: Product[];
  rating: number;
}
interface Product {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  header: string;
  view_btn_x: number;
  view_btn_y: number;
  display_x: number;
  display_y: number;
}

export default function MainPage() {
  const IsMobile = useIsMobile();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReview, setShowReview] = useState(false);
  // const [liked, setLiked] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [topics, setTopics] = useState<Record<string, Topic>>({});
  const [topicIds, setTopicIds] = useState<string[]>([""]);

  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    async function getTopics() {
      setIsLoading(true);

      const { data, error } = await supabase.from("topics").select(`
            *,
            products (*)
          `);

      if (error) {
        console.error("Failed to fetch users:", error);
        setIsLoading(false);
        return;
      }

      if (data) {
        const topicDictionary = Object.fromEntries(
          (data as Topic[]).map((topic) => [topic.id, topic]),
        );

        const topicIds = (data as Topic[]).map((topic) => topic.id);

        setTopicIds(topicIds);

        setTopics(topicDictionary);
      }

      setIsLoading(false);
    }

    getTopics();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [page]);

  useEffect(() => {
    if (topics) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
    }
  }, [topics]);

  useEffect(() => {
    console.log("topics state changed:", topics);
  }, [topics]);

  // const x = useMotionValue(0);
  // const y = useMotionValue(0);

  // const springX = useSpring(x, {
  //   stiffness: 120,
  //   damping: 20,
  //   mass: 0.7,
  // });

  // const springY = useSpring(y, {
  //   stiffness: 120,
  //   damping: 20,
  //   mass: 0.7,
  // });

  useEffect(() => {
    if (selectedProduct === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowDetails(false);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (showIntro && selectedProduct != null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedProduct(null);
      setShowDetails(false);
    }
  }, [showIntro]);

  // const selectProduct = (product: Product) => {
  //   setSelectedProduct(product);
  //   setShowDetails(false);
  // };
  if (!IsMobile)
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#eae6db] ">
        <div className="flex flex-col items-center   relative">
          {/* <img
            src={loadingAnimation}
            alt="Loading..."
            className="h-64 text-black   w-64"
          /> */}
          <h1 className="text-black text-6xl georgian-font">ukacravad,</h1>
          <h3 className="text-black text-3xl georgian-font mt-4">
            qalaqis saukeTeso kritikosis naxva <br /> mxolod telefoniTaa
            SesaZlebeli
          </h3>
          <h3 className="text-black text-xl  mt-4">
            Thank you for understanding :-)
          </h3>
        </div>
      </div>
    );

  return topicIds.length === 0 || isLoading ? (
    <div className="flex flex-col h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center   relative">
        <img src={loadingAnimation} alt="Loading..." className="h-64   w-64" />
        <h3 className="text-white absolute bottom-12">სუულ ცოტაც...</h3>
      </div>
    </div>
  ) : (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-black text-white">
      {/* ------------------------------------------------ */}
      {/* HERO IMAGE                                       */}
      {/* ------------------------------------------------ */}

      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        // style={{
        //   x: springX,
        //   y: springY,
        //   scale: 1.08,
        // }}
        drag
        dragConstraints={{
          left: -120,
          right: 120,
          top: -100,
          bottom: 100,
        }}
        dragElastic={0.12}
        dragTransition={{
          bounceStiffness: 180,
          bounceDamping: 25,
        }}
      >
        <motion.img
          src={topics[topicIds.at(page) ?? "no_topic"]?.cover_img}
          alt="Influencer"
          className="h-full w-full select-none object-cover"
          draggable={false}
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{
            scale: showIntro ? 1.04 : 1,
            opacity: 1,
          }}
          transition={{
            duration: 1.8,
            // ease: [0.16, 1, 0.3, 1],
          }}
        />
      </motion.div>

      {/* ------------------------------------------------ */}
      {/* IMAGE GRADIENT                                   */}
      {/* ------------------------------------------------ */}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      {/* ------------------------------------------------ */}
      {/* TOP BAR                                          */}
      {/* ------------------------------------------------ */}

      <motion.header
        className="absolute left-0 right-0 top-8 z-30 flex items-center justify-between px-5 pt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        {/* <GlassButton>
          <ArrowLeft size={21} />
        </GlassButton> */}

        <motion.div
          className="absolute left-1/2  -translate-x-1/2 -top-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="flex  items-center justify-center rounded-full bg-[#697315] shadow-2xl">
            <img
              src={topics[topicIds.at(page) ?? "no_topic"]?.logo_img}
              className="object-cover size-24 rounded-full"
              alt=""
            />
          </div>
        </motion.div>
      </motion.header>
      <div className="absolute left-1/2  -translate-x-1/2 top-28 ">
        {/* <Rating rating={topics[topicIds[page] ?? ""].rating ?? 0} /> */}
        <Rating rating={topics[topicIds[page] ?? ""]?.rating ?? 0} />
      </div>

      {/* ------------------------------------------------ */}
      {/* INTRO                                            */}
      {/* ------------------------------------------------ */}

      {/* <AnimatePresence>
        {showIntro && (
          <motion.div
            className="absolute left-6 bottom-[50%] z-20"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.5 }}
            exit={{
              opacity: 0,
              x: -20,
              transition: { duration: 0.3 },
            }}
          >
            <h1 className="max-w-[230px] text-center georgian-font  text-[44px] leading-[0.95]">
              aRmoaCine
              <br />
              luqi
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <div className="h-[1px] w-7 bg-[#b4bd48]" />

              <p className="text-sm text-white/80">
                დააჭირე &
                <br />
                ნახე დეტალები
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* ------------------------------------------------ */}
      {/* DRAG GUIDE                                       */}
      {/* ------------------------------------------------ */}
      {/* 
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="absolute left-6 top-[39%] z-20 rounded-2xl border border-white/20 bg-black/40 p-4 backdrop-blur-xl"
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -30,
            }}
            transition={{
              delay: 0.8,
              duration: 0.6,
            }}
          >
            <motion.div
              animate={{
                x: [0, 12, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.7,
              }}
              className="mb-3"
            >
              <ArrowRight size={25} />
            </motion.div>

            <p className="text-xs font-medium">Drag to explore</p>
            <p className="mt-1 text-[11px] text-white/60">
              Swipe around the image
            </p>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* ------------------------------------------------ */}
      {/* PRODUCT HOTSPOTS                                 */}
      {/* ------------------------------------------------ */}

      <div className="absolute inset-0 z-10 pointer-events-none">
        {topics[topicIds.at(page) ?? "no_topic"]?.products.map(
          (product, index) => {
            const isSelected = selectedProduct?.id === product.id;

            return (
              <motion.button
                key={product.id}
                className="pointer-events-auto absolute"
                style={{
                  left: `${product.view_btn_x}%`,
                  top: `${product.view_btn_y}%`,
                }}
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 1.8 + index * 0.82,
                  // type: "spring",
                  // stiffness: 300,
                  // damping: 18,
                }}
                whileHover={{
                  scale: 1.08,
                }}
                whileTap={{
                  scale: 0.92,
                }}
                onClick={() => {
                  setSelectedProduct((prev) => (prev ? null : product));
                  // setShowDetails(false);
                }}
              >
                <div className="relative flex items-center gap-2">
                  <motion.div
                    style={{
                      borderColor: isSelected
                        ? topics[topicIds.at(page) ?? "no_topic"]
                            .secondary_color
                        : "",
                      backgroundColor: isSelected
                        ? topics[topicIds.at(page) ?? "no_topic"].primary_color
                        : "",
                    }}
                    className={`relative flex border-gray-500/20 bg-black/50 text-white h-11 w-11 items-center justify-center rounded-full border   backdrop-blur-md`}

                    // animate={
                    //   isSelected
                    //     ? {
                    //         boxShadow: [
                    //           "0 0 0 0 rgba(170,181,29,0.5)",
                    //           "0 0 0 12px rgba(170,181,29,0)",
                    //         ],
                    //       }
                    //     : {}
                    // }
                    // transition={{
                    //   repeat: isSelected ? Infinity : 0,
                    //   duration: 1.6,
                    // }}
                  >
                    <span className="text-xl font-light">+</span>
                  </motion.div>

                  <AnimatePresence>
                    {(isSelected || !showIntro) && (
                      <motion.div
                        className="rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-left backdrop-blur-xl"
                        initial={{
                          opacity: 0,
                          x: (selectedProduct?.display_x ?? 0) - 60,
                          y: selectedProduct?.display_y ?? 0,
                        }}
                        animate={{
                          opacity: 1,
                          x: (selectedProduct?.display_x ?? 0) - 60,
                          y: selectedProduct?.display_y ?? 0,
                        }}
                        // exit={{
                        //   opacity: 0,
                        //   x: -10,
                        //   width: 0,
                        // }}
                      >
                        <div className="whitespace-nowrap text-xs font-medium">
                          {product.name}
                        </div>

                        {/* <div className="mt-0.5 text-[10px] text-white/50">
                        {product.category}
                      </div> */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          },
        )}
      </div>

      {/* ------------------------------------------------ */}
      {/* RIGHT ACTIONS                                    */}
      {/* ------------------------------------------------ */}

      <motion.div
        className="absolute right-5 top-[55%] z-20 flex flex-col gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
      >
        {/* <GlassButton>
          <Search size={20} />
        </GlassButton> */}

        {/* <GlassButton>
          <Share2 size={19} />
        </GlassButton> */}

        {/* <GlassButton onClick={() => setLiked(!liked)}>
          <motion.div
            animate={{
              scale: liked ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 0.35 }}
          >
            <Heart
              size={19}
              fill={liked ? "currentColor" : "none"}
              className={liked ? "text-[#aab51d]" : ""}
            />
          </motion.div>
        </GlassButton> */}
      </motion.div>

      {/* ------------------------------------------------ */}
      {/* BOTTOM SWIPE BAR                                 */}
      {/* ------------------------------------------------ */}

      <AnimatePresence>
        {!selectedProduct && (
          <motion.div
            className="absolute   flex justify-between w-full bottom-10 p-8 left-12ფ z-20 "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {page > 0 ? (
              <motion.div
                onClick={() => setPage((prev) => prev - 1)}
                // whileTap={{ y: 13 }}
                className="flex items-center gap-4  w-18 h-18  rounded-full border border-white/15 bg-black/20  px-3 py-3 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <ChevronDown className="rotate-90 size-12" />
              </motion.div>
            ) : (
              <div className="w-18" />
            )}
            <AnimatePresence>
              <button
                onClick={() => setShowReview(true)}
                className="flex flex-col  items-center"
              >
                <motion.div
                  className="flex items-center gap-4 w-18 h-18 rounded-full border border-white/15 bg-black/20 px-3 py-3 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: 0, duration: 0.4 }}
                >
                  <ReceiptText className="size-8 mx-auto" />
                </motion.div>

                <svg
                  width="100"
                  height="35"
                  viewBox="0 0 100 35"
                  className="-mt-1 overflow-visible"
                >
                  <path id="textArc" d="M 8,8 Q 50,35 92,8" fill="none" />

                  <text
                    fill="white"
                    fontSize="11"
                    fontWeight="500"
                    letterSpacing="0.5"
                  >
                    <textPath
                      href="#textArc"
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      შეფასება
                    </textPath>
                  </text>
                </svg>
              </button>
            </AnimatePresence>
            <AnimatePresence>
              {page < topicIds.length - 1 ? (
                <motion.div
                  onClick={() => setPage((prev) => prev + 1)}
                  className="flex items-center gap-4 w-18 h-18  rounded-full border border-white/15 bg-black/20 px-3 py-3 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: 0, duration: 0.4 }}
                >
                  <ChevronDown className="-rotate-90 size-12" />
                </motion.div>
              ) : (
                <div className="w-18 " />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------ */}
      {/* PRODUCT PREVIEW SHEET                            */}
      {/* ------------------------------------------------ */}

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-40"
            initial={{
              y: "100%",
            }}
            animate={{
              y: 0,
            }}
            exit={{
              y: "100%",
            }}
            // transition={{
            //   type: "spring",
            //   stiffness: 240,
            //   damping: 28,
            // }}
          >
            <div className="rounded-t-[32px] border-t border-white/10 bg-[#111111]/95 p-4 shadow-2xl backdrop-blur-2xl">
              {/* handle */}

              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20" />

              <div className="flex gap-4">
                <motion.img
                  src={selectedProduct.image_url}
                  className="h-28 w-24 rounded-2xl object-cover"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  // transition={{
                  //   type: "spring",
                  //   stiffness: 300,
                  // }}
                />

                <div className="flex flex-1 flex-col justify-center">
                  {/* <div className="text-[11px] uppercase tracking-[0.15em] text-white/40">
                    {selectedProduct.category}
                  </div> */}

                  <h2 className="mt-1 text-lg font-medium">
                    {selectedProduct.name}
                  </h2>

                  <div className="mt-1 text-sm text-white/70">
                    {selectedProduct.description}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <motion.button
                      className={`rounded-full bg-[${topics[topicIds.at(page) ?? "no_topic"].primary_color}] px-5 py-2 text-xs font-semibold text-`}
                      whileHover={{
                        scale: 1.03,
                      }}
                      style={{
                        backgroundColor:
                          topics[topicIds.at(page) ?? "no_topic"].primary_color,
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      onClick={() => setShowDetails(true)}
                    >
                      მეტის ნახვა
                    </motion.button>

                    {/* <motion.button
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15"
                      whileTap={{
                        scale: 0.9,
                      }}
                      onClick={() => setLiked(!liked)}
                    >
                      <Heart size={16} fill={liked ? "currentColor" : "none"} />
                    </motion.button> */}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute right-5 top-5 text-white/50 transition hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------ */}
      {/* PRODUCT DETAIL MODAL                             */}
      {/* ------------------------------------------------ */}

      <AnimatePresence>
        {showDetails && selectedProduct && (
          <motion.div
            className="absolute inset-0 z-50 flex items-end  p-3 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-[70%] w-full overflow-hidden  backdrop-blur-2xl bg-[#eae6db]  rounded-2xl"
              initial={
                {
                  // y: "100%",
                  // scale: 0.96,
                }
              }
              transition={{ duration: 0.4 }}
              animate={{
                y: 0,
                scale: 1,
              }}
              exit={{
                // y: "100%",
                scale: 0.96,
              }}
              // transition={{
              //   type: "spring",
              //   stiffness: 240,
              //   damping: 28,
              // }}
            >
              <div className="relative">
                {/* <img
                  src={selectedProduct.image_url ?? ""}
                  className="h-64 w-full object-cover"
                  alt={selectedProduct.name}
                /> */}

                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                {/* <div className="text-xs uppercase tracking-[0.18em] text-black/40">
                  {selectedProduct.category}
                </div> */}

                <div className="mt-2 flex items-start justify-between gap-5">
                  <h2 className="font-serif text-3xl text-black">
                    {selectedProduct.name}
                  </h2>

                  {/* <span className="text-lg font-medium">
                    ${selectedProduct.price}
                  </span> */}
                </div>

                <p className="mt-5 text-sm leading-6 text-black/60">
                  {selectedProduct.description}
                </p>

                {/* <div className="mt-7 grid grid-cols-3 gap-2">naxe</div> */}

                {/* <motion.button
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-black py-4 text-sm font-medium text-white"
                  whileHover={{
                    scale: 1.015,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                >
                  Add to collection
                  <ShoppingBag size={17} />
                </motion.button> */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showReview && (
          <motion.div
            className="absolute inset-0 z-50 flex items-end  p-3 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-[70%] w-full overflow-hidden  backdrop-blur-2xl bg-[#eae6db]  rounded-2xl"
              initial={{ y: 40 }}
              transition={{ duration: 0.4 }}
              animate={{
                y: 0,
                scale: 1,
              }}
              exit={{
                scale: 0.96,
              }}
            >
              <div className="relative">
                <button
                  onClick={() => setShowReview(false)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                {/* <div className="text-xs uppercase tracking-[0.18em] text-black/40">
                  {selectedProduct.category}
                </div> */}

                <div className="mt-2 flex flex-col items-start justify-between gap-5">
                  {/* <h2 className="font-serif text-3xl text-black">შეფასება</h2> */}

                  <h1 className="max-w-[230px] text-black text-center georgian-font  text-[44px] leading-[0.95]">
                    Sefaseba
                  </h1>
                  <h1 className="max-w-[230px] text-black text-center text-[14px] leading-[0.95]">
                    კერძი #1 - იმენა ყლეობა
                  </h1>
                  <h1 className="max-w-[230px] text-black text-center text-[14px] leading-[0.95]">
                    კერძი #2 - ძაან ყლეობა
                  </h1>
                  <h1 className="max-w-[230px] text-black text-center text-[14px] leading-[0.95]">
                    კერძი #3 - სულმთლა ყლეობა
                  </h1>

                  {/* <span className="text-lg font-medium">
                    ${selectedProduct.price}
                  </span> */}
                </div>

                {/* <p className="mt-5 text-sm leading-6 text-black/60">
                  {selectedProduct.description}
                </p> */}

                {/* <div className="mt-7 grid grid-cols-3 gap-2">naxe</div> */}

                {/* <motion.button
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-black py-4 text-sm font-medium text-white"
                  whileHover={{
                    scale: 1.015,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                >
                  Add to collection
                  <ShoppingBag size={17} />
                </motion.button> */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------ */}
      {/* BOTTOM NAV                                       */}
      {/* ------------------------------------------------ */}

      {/* <motion.nav
        className="absolute bottom-0 left-0 right-0 z-30 flex h-[82px] items-center justify-around border-t border-white/10 bg-black/75 px-3 backdrop-blur-xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{
          delay: 0.5,
          type: "spring",
          stiffness: 200,
          damping: 25,
        }}
      >
        <NavItem active icon="◈" label="Explore" />

        <NavItem icon="▦" label="Collections" />

        <NavItem icon="♡" label="Wishlist" />

        <NavItem icon="♙" label="Profile" />
      </motion.nav> */}

      {/* ------------------------------------------------ */}
      {/* CLOSE INTRO AFTER INTERACTION                    */}
      {/* ------------------------------------------------ */}

      <button
        className="absolute inset-0 z-[5] cursor-default"
        onClick={() => setShowIntro((prev) => !prev)}
        aria-label="Start exploring"
      />
    </main>
  );
}
