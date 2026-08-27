import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowBigDown,
  ArrowBigUp,
  Crown,
  Medal,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";

import { supabase } from "../utils/supabase";
// change path above if needed

type Comment = {
  id: number;
  postTitle: string;
  score: number;
  createdAt: string;
  value: string;
};

type User = {
  id: number;
  name: string;
  username: string;
  avatar_url: string;
  comments: Comment[];
};

type LeaderboardComment = Comment & {
  name: string;
  username: string;
  avatar: string;
};

export default function CommentLeaderboard() {
  const [users, setUsers] = useState<User[]>([]);

  const [votes, setVotes] = useState<Record<number, "up" | "down" | null>>({});

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUsers() {
      setIsLoading(true);

      const { data, error } = await supabase.from("users").select(`
          *,
          comments (*)
        `);

      if (error) {
        console.error("Failed to fetch users:", error);
        setIsLoading(false);
        return;
      }

      if (data) {
        setUsers(data as User[]);
      }

      setIsLoading(false);
    }

    getUsers();
  }, []);

  /**
   * Supabase gives us:
   *
   * [
   *   {
   *     name: "...",
   *     username: "...",
   *     comments: [...]
   *   }
   * ]
   *
   * But the leaderboard wants:
   *
   * [
   *   {
   *     comment: "...",
   *     name: "...",
   *     username: "..."
   *   }
   * ]
   *
   * so flatten everything.
   */
  const comments = useMemo<LeaderboardComment[]>(
    () =>
      users.flatMap((user) =>
        (user.comments ?? []).map((comment) => ({
          ...comment,
          name: user.name,
          username: user.username,
          avatar: user.avatar_url,
        })),
      ),
    [users],
  );

  const rankedComments = useMemo(
    () => [...comments].sort((a, b) => b.score - a.score),
    [comments],
  );

  const vote = (id: number, direction: "up" | "down") => {
    const previousVote = votes[id];

    let difference = 0;

    // Clicking the same vote again removes it
    if (previousVote === direction) {
      difference = direction === "up" ? -1 : 1;

      setVotes((prev) => ({
        ...prev,
        [id]: null,
      }));
    } else {
      // First vote
      if (!previousVote) {
        difference = direction === "up" ? 1 : -1;
      }

      // Switching from up -> down or down -> up
      else {
        difference = direction === "up" ? 2 : -2;
      }

      setVotes((prev) => ({
        ...prev,
        [id]: direction,
      }));
    }

    // Update nested comment in users state
    setUsers((prev) =>
      prev.map((user) => ({
        ...user,

        comments: (user.comments ?? []).map((comment) =>
          comment.id === id
            ? {
                ...comment,
                score: comment.score + difference,
              }
            : comment,
        ),
      })),
    );
  };

  return (
    <main className="min-h-screen bg-[#08070d]  text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="absolute bottom-[-250px] right-[-150px] h-[500px] w-[500px] rounded-full bg-fuchsia-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-10"
        >
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-violet-300">
            <Sparkles className="size-4" />
            COMMUNITY FAVORITES
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                კომენტართა
                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  {" "}
                  საუკეთესონი
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                ყველაზე სახალისო, კრეატიული და უთუოდ ინტელექტის გამომჟღავნების
                კომენტართა კრებული
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
              <MessageCircleMore className="size-5 text-violet-400" />

              <div>
                <p className="text-xs text-zinc-500">Comments ranked</p>

                <p className="font-semibold">{comments.length}</p>
              </div>
            </div>
          </div>
        </motion.header>

        {isLoading ? (
          <LoadingState />
        ) : comments.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Top 3 */}
            <section className="mb-8 grid gap-3 md:grid-cols-3">
              {rankedComments.slice(0, 3).map((comment, index) => (
                <TopCard key={comment.id} comment={comment} rank={index + 1} />
              ))}
            </section>

            {/* Leaderboard */}
            <section>
              <div className="mb-3 grid grid-cols-[45px_1fr_auto] px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-600 sm:grid-cols-[60px_1fr_130px]">
                <span>Rank</span>

                <span>Comment</span>

                <span className="text-right">Votes</span>
              </div>

              <motion.div layout className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {rankedComments.map((comment, index) => {
                    const voteState = votes[comment.id];

                    return (
                      <motion.article
                        layout
                        layoutId={`comment-${comment.id}`}
                        key={comment.id}
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.97,
                        }}
                        transition={{
                          layout: {
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          },
                        }}
                        className="group grid grid-cols-[45px_minmax(0,1fr)] gap-x-2 rounded-2xl border border-white/[0.07] bg-[#0e0d15]/90 p-3 transition-colors hover:border-violet-400/25 hover:bg-[#11101a] sm:grid-cols-[60px_minmax(0,1fr)_130px] sm:items-center sm:p-4"
                      >
                        {/* Rank */}
                        <div className="flex items-start justify-center sm:items-center">
                          <RankBadge rank={index + 1} />
                        </div>

                        {/* User + comment */}
                        <div className="min-w-0">
                          <div className="mb-3 flex items-center gap-3">
                            <UserAvatar
                              src={comment.avatar}
                              name={comment.name}
                            />

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-semibold text-zinc-100">
                                  {comment.name}
                                </p>

                                {index === 0 && (
                                  <Crown className="size-3.5 shrink-0 text-amber-400" />
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                <span>{comment.username}</span>

                                <span>{comment.value}</span>

                                <span>{comment.createdAt}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm leading-6 text-zinc-300 sm:text-[15px]">
                            “{comment.value}”
                          </p>

                          {comment.postTitle && (
                            <p className="mt-3 truncate text-xs text-zinc-600">
                              On{" "}
                              <span className="text-zinc-500">
                                {comment.postTitle}
                              </span>
                            </p>
                          )}
                        </div>

                        {/* Voting */}
                        <div className="col-span-2 mt-4 flex items-center justify-end sm:col-span-1 sm:mt-0">
                          <VoteControls
                            comment={comment}
                            voteState={voteState}
                            onVote={vote}
                          />
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function VoteControls({
  comment,
  voteState,
  onVote,
}: {
  comment: LeaderboardComment;
  voteState: "up" | "down" | null | undefined;
  onVote: (id: number, direction: "up" | "down") => void;
}) {
  return (
    <div className="flex items-center overflow-hidden rounded-xl border border-white/[0.08] bg-black/20">
      <motion.button
        whileTap={{
          scale: 0.88,
        }}
        onClick={() => onVote(comment.id, "up")}
        aria-label="Upvote"
        className={`flex size-10 items-center justify-center transition ${
          voteState === "up"
            ? "bg-violet-500/20 text-violet-300"
            : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
        }`}
      >
        <ArrowBigUp
          className="size-[18px]"
          fill={voteState === "up" ? "currentColor" : "none"}
        />
      </motion.button>

      <motion.span
        key={comment.score}
        initial={{
          scale: 1.2,
          opacity: 0.4,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        className="min-w-[52px] text-center text-sm font-bold tabular-nums text-zinc-200"
      >
        {formatNumber(comment.score)}
      </motion.span>

      <motion.button
        whileTap={{
          scale: 0.88,
        }}
        onClick={() => onVote(comment.id, "down")}
        aria-label="Downvote"
        className={`flex size-10 items-center justify-center transition ${
          voteState === "down"
            ? "bg-rose-500/15 text-rose-400"
            : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
        }`}
      >
        <ArrowBigDown
          className="size-[18px]"
          fill={voteState === "down" ? "currentColor" : "none"}
        />
      </motion.button>
    </div>
  );
}

function TopCard({
  comment,
  rank,
}: {
  comment: LeaderboardComment;
  rank: number;
}) {
  const labels = {
    1: "საუკეთესო",
    2: "საუკეთესოს მერე რო მოდის",
    3: "ისე რა",
  };

  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={`relative overflow-hidden rounded-2xl border p-5 ${
        rank === 1
          ? "border-amber-400/20 bg-gradient-to-br from-amber-400/[0.08] to-[#0e0d15]"
          : "border-white/[0.07] bg-[#0e0d15]"
      }`}
    >
      <div className="absolute right-[-25px] top-[-25px] size-28 rounded-full bg-violet-500/5 blur-2xl" />

      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RankBadge rank={rank} />

            <span className="text-xs font-medium text-zinc-500">
              {labels[rank as keyof typeof labels]}
            </span>
          </div>

          <span className="text-sm font-bold text-zinc-300">
            {formatNumber(comment.score)}
          </span>
        </div>

        <p className="line-clamp-3 min-h-[72px] text-sm leading-6 text-zinc-300">
          “{comment.value}”
        </p>

        <div className="mt-5 flex items-center gap-2.5">
          <UserAvatar src={comment.avatar} name={comment.name} small />

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-zinc-200">
              {comment.name}
            </p>

            <p className="truncate text-[11px] text-zinc-600">
              {comment.username}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const styles = {
      1: "border-amber-400/20 bg-amber-400/10 text-amber-400",
      2: "border-zinc-300/15 bg-zinc-300/10 text-zinc-300",
      3: "border-orange-500/15 bg-orange-500/10 text-orange-400",
    };

    return (
      <div
        className={`flex size-8 items-center justify-center rounded-lg border ${
          styles[rank as keyof typeof styles]
        }`}
      >
        <Medal className="size-4" />
      </div>
    );
  }

  return (
    <span className="flex size-8 items-center justify-center text-sm font-bold tabular-nums text-zinc-600">
      {rank.toString().padStart(2, "0")}
    </span>
  );
}

function UserAvatar({
  src,
  name,
  small = false,
}: {
  src?: string;
  name: string;
  small?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  const sizeClass = small ? "size-8" : "size-10";

  if (!src || failed) {
    return (
      <div
        className={`${sizeClass} flex shrink-0 text-xl items-center justify-center rounded-full bg-violet-500/15 font-semibold text-violet-300 ring-1 ring-violet-500/20`}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className={`${sizeClass} shrink-0 rounded-full object-cover ring-1 size-24 ring-white/10`}
    />
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({
        length: 5,
      }).map((_, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: index * 0.05,
          }}
          className="h-32 animate-pulse rounded-2xl border border-white/[0.05] bg-white/[0.025]"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center"
    >
      <MessageCircleMore className="mb-4 size-8 text-zinc-600" />

      <h2 className="font-semibold text-zinc-300">No comments yet</h2>

      <p className="mt-2 text-sm text-zinc-600">
        Comments will show up here once users have some.
      </p>
    </motion.div>
  );
}

function formatNumber(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }

  return value.toString();
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}
