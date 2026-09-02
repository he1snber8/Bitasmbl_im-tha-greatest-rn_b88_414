import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Scaling, X } from "lucide-react";
import loadingAnimation from "../assets/klima-loading.svg";

import "../index.css";
import { supabase } from "../../utils/supabase";
// import { supabase } from "../hooks/";

import { Rating } from "../assets/ui/Review";
import useIsMobile from "../hooks/useIsMobile";
import { LuListCheck } from "react-icons/lu";
import { GoPlus } from "react-icons/go";
import { BiSolidQuoteAltLeft } from "react-icons/bi";

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
  plus_btn_color?: string;
  secondary_color?: string;
  products: Product[];
  dish_reviews: DishReview[];
  rating: number;
}
interface Product {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  raw_image_url?: string;
  source_url?: string;
  header: string;
  view_btn_x: number;
  view_btn_y: number;
  display_x: number;
  display_y: number;
}
interface DishReview {
  id: number;
  price: number;
  name: string;
  score: number;
  image_url?: string;
  review: string;
  tags: string;
  topic: string;
}

export default function MainPage() {
  const IsMobile = useIsMobile();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState<{
    product: Product | null;
    show: boolean;
  }>({ product: null, show: false });
  const [showReview, setShowReview] = useState(false);

  // const [liked, setLiked] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const [topics, setTopics] = useState<Record<string, Topic>>({});
  const [topicIds, setTopicIds] = useState<string[]>([""]);

  const [page, setPage] = useState<number>(-1);

  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/set-state-in-effect
  //   setLoaded(false);
  // }, [page, topicIds]);

  useEffect(() => {
    async function getTopics() {
      setIsLoading(true);

      const { data, error } = await supabase.from("topics").select(`
            *,
            products (*),
            dish_reviews (*)
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

  const TOPICS_END_PAGE = topicIds.length;

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

  if (TOPICS_END_PAGE === page)
    return (
      <div className="fixed inset-0 z-[999]  flex items-center justify-center overflow-hidden bg-[#eae6db] touch-none">
        <motion.img
          src={"./klima-end-bg.png"}
          alt="Influencer"
          draggable={false}
          onLoad={() => setLoaded(true)}
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{
            scale: showIntro ? 1.04 : 1,
            opacity: loaded ? 1 : 0,
          }}
          transition={{
            scale: {
              duration: 1.8,
            },
            opacity: {
              duration: 0.5,
            },
          }}
          className="h-full w-full object-cover absolute opacity-30!"
        />

        <div className="flex flex-col items-center gap-4">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1.2 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            src={"./klima-confused.png"}
            alt="Loading..."
            className="h-64  -translate-y-8 w-64"
          />
          <motion.div
            onClick={() => setPage((prev) => prev - 1)}
            // whileTap={{ y: 13 }}
            className="flex absolute left-8 top-4 items-center gap-4  w-18 h-18  rounded-full border border-white/15 bg-black/20  px-3 py-3 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <ChevronDown className="rotate-90 size-12" />
          </motion.div>
          <p className="absolute bottom-20 text-[15px] georgian-font-2 leading-[1.65] text-black/65">
            {/* {selectedProduct?.review ?? */}
            ახალი განხილვა ყოველ სამშაბათს, 20:00-ზე
          </p>
        </div>
      </div>
    );

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

  if (page === -1) {
    return (
      <div className="fixed inset-0 z-[999]  flex items-center justify-center overflow-hidden bg-[#eae6db]">
        {/* Subtle decorative background */}
        <motion.img
          src={"./klima-bg.png"}
          alt="Influencer"
          draggable={false}
          onLoad={() => setLoaded(true)}
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{
            scale: showIntro ? 1.04 : 1,
            opacity: loaded ? 1 : 0,
          }}
          transition={{
            scale: {
              duration: 1.8,
            },
            opacity: {
              duration: 0.5,
            },
          }}
          className="h-full w-full object-cover absolute opacity-40!"
        />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[28%] h-72 w-72 -translate-x-1/2 rounded-full bg-orange-700/[0.04] blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center">
          {/* Character */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
          >
            <motion.img
              src="./klima-cute.png"
              alt="Klima"
              className="w-64 sm:w-72"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Floating heart */}
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.08, 1],
                rotate: [-8, 4, -8],
              }}
              transition={{
                delay: 0.8,
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute right-2 top-8 text-4xl text-black"
            >
              ♡
            </motion.span>
          </motion.div>

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="-mt-10 flex flex-col items-center"
          >
            <span className="sail-regular text-[58px] leading-none tracking-tight text-black">
              ekkkuna
            </span>

            <div className="mt-4 flex items-center gap-3">
              <span className="h-px w-8 bg-black/20" />
              <span className="text-[9px] uppercase tracking-[0.35em] text-black/40">
                food · stories · opinions
              </span>
              <span className="h-px w-8 bg-black/20" />
            </div>
          </motion.div>

          {/* Start button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.6,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.96,
            }}
            onClick={() => setPage((prev) => prev + 1)}
            className="group georgian-font-2 mt-8 flex items-center gap-3 rounded-full border border-black/80 bg-black px-9 py-4 text-lg font-bold text-[#eae6db] transition-colors duration-300 hover:bg-black/90"
          >
            <span>დაწყება</span>

            <motion.span
              className="text-base"
              animate={{ x: [0, 3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              →
            </motion.span>
          </motion.button>

          {/* Tiny footer detail */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-5 text-[9px] uppercase tracking-[0.3em] text-black/25"
          >
            შენი გემოვნების დღიური
          </motion.span>
        </div>
      </div>
    );
  }

  return topicIds.length === 0 || isLoading ? (
    <div className="flex flex-col h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center   relative">
        <img src={loadingAnimation} alt="Loading..." className="h-64   w-64" />
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
        {/* <TopicImage
          src={topics[topicIds.at(page) ?? "no_topic"]?.cover_img ?? "no_topic"}
          alt={topics[topicIds.at(page) ?? "no_topic"]?.id}
        /> */}
        <div className="relative h-full w-full">
          {!loaded && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
              <img
                src={loadingAnimation}
                alt="Loading..."
                className="h-64 w-64"
              />
            </div>
          )}

          <motion.img
            src={topics[topicIds.at(page) ?? "no_topic"]?.cover_img}
            alt="Influencer"
            draggable={false}
            onLoad={() => setLoaded(true)}
            initial={{ scale: 1.04, opacity: 0 }}
            animate={{
              scale: showIntro ? 1.04 : 1,
              opacity: loaded ? 1 : 0,
            }}
            transition={{
              scale: {
                duration: 1.8,
              },
              opacity: {
                duration: 0.5,
              },
            }}
            className="h-full w-full object-cover"
          />
        </div>
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
                    <span
                      style={{
                        color:
                          topics[topicIds.at(page) ?? "no_topic"]
                            .plus_btn_color,
                      }}
                      className="text-xl font-light"
                    >
                      <GoPlus className="size-8" />
                    </span>
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
                onClick={() => {
                  setSelectedTopic(topics[topicIds.at(page) ?? "no_topic"]);
                  setShowReview(true);
                }}
                className="flex flex-col  items-center"
              >
                <motion.div
                  className="flex items-center gap-4 w-18 h-18 rounded-full border border-white/15 bg-black/20 px-3 py-3 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: 0, duration: 0.4 }}
                >
                  <LuListCheck className="size-8 mx-auto" />
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
                      className="georgian-font-2 text-xl font-semibold"
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
              {page !== TOPICS_END_PAGE ? (
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

                  <h2 className="mt-1 text-xl georgian-font-2  font-medium">
                    {selectedProduct.name}
                  </h2>

                  <div className="mt-1 text-sm georgian-font-2  text-white/70">
                    {selectedProduct.description}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <motion.button
                      className={`rounded-full georgian-font-2  bg-[${topics[topicIds.at(page) ?? "no_topic"].primary_color}] px-5 py-2 text-base font-semibold text-`}
                      whileHover={{
                        scale: 1.03,
                      }}
                      style={{
                        backgroundColor:
                          topics[topicIds.at(page) ?? "no_topic"].primary_color,
                        color:
                          topics[topicIds.at(page) ?? "no_topic"]
                            .plus_btn_color,
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
      {/* <div className="relative"> */}

      <AnimatePresence>
        {showDetails && selectedProduct && (
          <motion.div
            className="absolute inset-0 z-50 overflow-hidden bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Image */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.02, opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                className="h-full w-full border object-cover"
              />
              <div
                onClick={() =>
                  setShowProductDetails({
                    product: selectedProduct,
                    show: true,
                  })
                }
                className="h-6 w-6 border flex flex-col items-center justify-center align-middle border-white -2 rounded-full z-100 absolute  "
              >
                <div className="h-4 w-4 animate-pulse  bg-white rounded-full z-100 absolute  " />
              </div>
            </motion.div>

            {/* Subtle cinematic overlay */}
            {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" /> */}

            {/* Close button */}
            <motion.button
              onClick={() => setShowDetails(false)}
              className="
          absolute right-5 top-5 z-20
          flex size-12 items-center justify-center
          rounded-full
          border border-white/15
          bg-gray-400/30

          text-white
          backdrop-blur-sm
          shadow-2xl
        "
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.25,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
            >
              <X className="size-5" />
            </motion.button>

            {/* Bottom navigation island */}

            {/* Previous */}
            {/* <motion.button
                className="
              flex size-11 items-center justify-center
              rounded-full
              text-white/70
             transition-colors
             hover:bg-white/10 hover:text-white
                 "
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}

              >
                <ChevronLeft className="size-5" />
              </motion.button> */}

            {/* Current image indicator */}
            <motion.div
              className="
    absolute bottom-5 left-1/2 z-20
    -translate-x-1/2
    flex items-center
    rounded-full min-w-max
    border border-white/15
    bg-black/45 gap-1
    px-3 py-2
    backdrop-blur-2xl
    shadow-[0_20px_60px_rgba(0,0,0,0.4)]
  "
              initial={{ opacity: 0, y: 35, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.9 }}
              transition={{
                delay: 0.15,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="px-3 text-xl  font-medium  text-white/70">
                {selectedProduct.name}
              </span>

              {/* <div className="h-5 w-px bg-white/15" /> */}

              <button
                onClick={() =>
                  setShowProductDetails({
                    product: selectedProduct,
                    show: true,
                  })
                }
                className="
      flex size-9 items-center justify-center
      rounded-full
      bg-white/10
      text-whiteდ
      transition-colors
      hover:bg-white/20
    "
              >
                <Scaling className="size-4" />
              </button>

              <button
                onClick={() => setShowDetails(false)}
                className="
      flex size-9 items-center justify-center
      rounded-full
      bg-white/10
      text-white
      transition-colors
      hover:bg-white/20
    "
              >
                <X className="size-4" />
              </button>
            </motion.div>
          </motion.div>
          // </motion.div>ç
        )}
      </AnimatePresence>

      {/* <AnimatePresence>
        {showDetails && selectedProduct && (
          <motion.div
            className="absolute inset-0 z-50 flex items-end  p-3 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-[70%] w-full overflow-hidden  backdrop-blur-2xl bg-[#eae6db]  rounded-2xl"
         
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
                  onClick={() => setShowDetails(false)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">

                <div className="mt-2 flex items-start justify-between gap-5">
                  <h2 className="font-serif text-3xl text-black">
                    {selectedProduct.name}
                  </h2>
                </div>

                <p className="mt-5 text-sm leading-6 text-black/60">
                  {selectedProduct.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
      <AnimatePresence>
        {showReview && selectedTopic && (
          <motion.div
            className="absolute inset-0 z-50 flex items-end  p-3 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-h-[80vh] overflow-y-auto bg-[#eae6db] backdrop-blur-sm rounded-2xl scrollbar-hide"
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

              <div className="p-6 pb-10">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex flex-col  items- justify-between">
                    <div>
                      <p className="text-4xl mx-auto text-center  georgian-font-2 text-black ">
                        ჩემი შეფასება
                      </p>
                    </div>

                    {/* <span className="text-black/40 text-sm">
                      {topics[topicIds[page]]?.dish_reviews?.length ?? 0} კერძი
                    </span> */}
                  </div>

                  <div className="mt-4 h-px bg-black/10" />
                </div>

                {/* Dish reviews */}
                <div className="flex flex-col gap-5 relative ">
                  {topics[topicIds[page]]?.dish_reviews?.map(
                    (dish: DishReview, index: number) => (
                      <motion.article
                        key={dish.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.12,
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                        className="
            flex flex-col
            items-stretch
            gap-2
            rounded-3xl
            border border-black/10
            bg-black/[0.025]
            p-3
          "
                      >
                        <div className="flex items-start gap-2  ">
                          {dish.image_url && (
                            <div className="relative shrink-0 w-28 h-28 overflow-hidden rounded-2xl">
                              <img
                                src={dish.image_url}
                                alt={dish.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}

                          <div className="flex min-w-0 flex-1 flex-col py-1 ">
                            {/* Name */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col gap-2">
                                {/* <p className="mb-1 text-[9px] uppercase tracking-[0.2em] text-black/35">
                                  კერძი #{index + 1}
                                </p> */}

                                <h2 className="georgian-font-2 text-[18px] leading-[1.05] text-black font-semibold">
                                  {dish.name}
                                </h2>
                              </div>
                            </div>

                            {/* Stars */}
                            <div className="mt- flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const value = dish.score / 2;

                                return (
                                  <span
                                    key={star}
                                    className={
                                      star <= Math.floor(value)
                                        ? "text-[#D99A16] text-lg"
                                        : star - 0.5 <= value
                                          ? "text-[#D99A16] text-lg"
                                          : "text-black/15 text-lg"
                                    }
                                  >
                                    ★
                                  </span>
                                );
                              })}
                            </div>
                            <h3 className=" sail-regular w-max relative -translate-y-2  text-black  text-3xl">
                              {dish.price}
                              <span className="text-xl absolute top-4 -right-4 ">
                                ₾
                              </span>
                            </h3>

                            <div className=" flex  flex-wrap gap-1.5 mt-2 ">
                              {dish.tags.split(";").map((tag) => (
                                <span
                                  key={tag}
                                  className="
                                   georgian-font-2
                      rounded-full
                      w-max
                      border
                      border-black/10
                      px-2.5
                      py-1
                      2px]
                      text-black
                    "
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>

                            {/* Tags */}
                          </div>
                        </div>

                        <p className="text-[15px] georgian-font-2 leading-[1.45] italic text-black/65">
                          <div className="mr-1 inline-block align-top text-orange-700/40">
                            <BiSolidQuoteAltLeft />
                          </div>

                          {dish.review}
                          <div className="ml-1 inline-block rotate-180 align-bottom text-orange-700/40">
                            <BiSolidQuoteAltLeft />
                          </div>
                        </p>
                      </motion.article>
                    ),
                  )}
                  {/* <p className="mt-3 text-[13px] leading-[1.45] text-black/65">
                            {dish.review}
                          </p> */}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProductDetails.show && showProductDetails.product && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 p-3 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-[28px] bg-[#eae6db] shadow-2xl"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Close */}
              <motion.button
                onClick={() =>
                  setShowProductDetails({
                    show: false,
                    product: null,
                  })
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md"
              >
                <X size={19} strokeWidth={1.8} />
              </motion.button>

              {/* Scrollable content */}
              <div className="max-h-[92vh] overflow-y-auto scrollbar-hide">
                <div className="p-6 sm:p-8 md:p-10">
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.35 }}
                    className="mb-7 pr-14"
                  >
                    {/* <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-black/35">
                      პროდუქტი
                    </p> */}

                    {/* <h1 className="georgian-font text-[34px] leading-none text-black sm:text-[42px]">
                      {selectedProduct?.name}
                    </h1> */}
                  </motion.div>

                  {/* Product */}
                  <div className="flex flex-col gap-4">
                    {/* Product image */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.12,
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="relative flex min-h[320px] items-center justify-center overflow-hidden rounded-[24px] bg-black/[0.025]"
                    >
                      {selectedProduct?.image_url ? (
                        <img
                          src={selectedProduct.raw_image_url}
                          alt={selectedProduct.name}
                          className="h-full w-40 scale-120 object-contain p-6 mix-blend-multiply"
                        />
                      ) : (
                        <div className="text-sm text-black/30">
                          სურათი არ არის ხელმისაწვდომი
                        </div>
                      )}

                      {/* Product score */}
                      {/* <div className="absolute left-4 top-4 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-white/80 backdrop-blur-md">
                        <span className="text-lg font-medium leading-none text-black">

                        </span>

                        <span className="mt-1 text-[9px] uppercase tracking-wider text-black/40">
                          /10
                        </span>
                      </div> */}
                    </motion.div>

                    {/* Product information */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.18,
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex flex-col "
                    >
                      {/* Description */}
                      {selectedProduct?.description && (
                        <div className="rounded-2xl   p-5">
                          <p className="text-lg leading-[1.6] georgian-font-2 text-black/70">
                            {selectedProduct.description}
                          </p>
                        </div>
                      )}

                      {/* Product details */}
                      <div className="my-4 divide-y divide-black/[0.07] rounded-2xl border border-black/[0.07] bg-white/20" />

                      {selectedProduct?.source_url && (
                        <motion.a
                          href={selectedProduct.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-4 flex  items-center justify-center gap-3 rounded-2xl bg-[#241b17] px-5 py-4 text-sm text-white shadow-lg shadow-black/10 transition"
                        >
                          <span className="georgian-font-2 font-semibold text-lg">
                            ნახე ოფიციალურ საიტზე
                          </span>

                          <span className="text-lg leading-none">↗</span>
                        </motion.a>
                      )}
                    </motion.div>
                  </div>

                  {/* Divider */}
                  {/* <div className="my-7 h-px bg-black/10" /> */}

                  {/* Critic review */}
                  <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.25,
                      duration: 0.4,
                    }}
                    className="rounded-[24px] mt-8 relative border border-black/[0.07] bg-white/25 p-5 sm:p-6"
                  >
                    {/* Review header */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className="georgian-font-2 text-[25px] text-black">
                          რას ვფიქრობ
                        </h2>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-3">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => {
                            // const score = selectedProduct?.score ?? 0;
                            const score = 5;
                            const starValue = score / 2;

                            return (
                              <span
                                key={i}
                                className={
                                  i + 1 <= Math.floor(starValue)
                                    ? "text-[#d89b16] text-xl"
                                    : i < starValue
                                      ? "text-[#d89b16] text-xl"
                                      : "text-black/15 text-xl"
                                }
                              >
                                ★
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="mt-5 max-w-3xl text-[15px] georgian-font-2 leading-[1.65] text-black/65">
                      {/* {selectedProduct?.review ?? */}
                      ეს პროდუქტი ნამდვილად იმსახურებს ყურადღებას. გემოს,
                      ტექსტურისა და საერთო გამოცდილების მხრივ, ჩემი აზრით,
                      საკმაოდ კარგად არის დაბალანსებული.
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-4 text-black">
                      {/* Left ornament */}

                      {/* Name */}
                      <span className="sail-regular whitespace-nowrap text-[28px] leading-none">
                        ekkkuna
                      </span>
                    </div>
                  </motion.section>
                </div>
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
