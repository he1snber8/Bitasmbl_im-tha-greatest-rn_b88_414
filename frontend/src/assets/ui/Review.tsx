import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
}

export function Rating({ rating }: RatingProps) {
  return (
    <div className="flex items-center gap-1  scale-80">
      {[1, 2, 3, 4, 5].map((star, index) => {
        const fill = Math.min(Math.max(rating - star + 1, 0), 1);

        return (
          <motion.div
            key={star}
            className="relative size-5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.12,
              duration: 0.3,
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
          >
            {/* Empty star */}
            <Star className="absolute inset-0 size-5 text-white/20" />

            {/* Filled portion */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className="size-5 fill-current text-yellow-400" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
