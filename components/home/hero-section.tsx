"use client";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { Calendar, MapPin } from "lucide-react";

const HeroSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const titleVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  const logoVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotate: -5,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "backOut",
      },
    },
  };

  const infoVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.6,
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.8,
      },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
    },
  };

  const benefitsVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 1.1,
      },
    },
  };

  const benefitItemVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 1.3 + i * 0.1,
      },
    }),
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="relative w-full min-h-dvh flex flex-col items-center justify-center overflow-hidden px-4 bg-gradient-to-b from-secondary/30 via-background via-60% to-secondary/40"
    >
      {/* Background Images */}
      <Image
        className="absolute -right-14 -top-20 drop-shadow-2xl drop-shadow-primary/70"
        src="/redmsg.png"
        alt="dotted background"
        width={216}
        height={179}
      />
      <Image
        className="absolute -left-18 -top-14 -z-10 drop-shadow-2xl drop-shadow-secondary/70"
        src="/bluestarblur.png"
        alt="dotted background"
        width={146}
        height={156}
      />{" "}
      <Image
        className="absolute -right-28 -bottom-28 -z-10 drop-shadow-2xl drop-shadow-secondary/70 w-72"
        src="/bluestarbigblur.png"
        alt="dotted background"
        width={208}
        height={219}
      />
      <div className="lg:py-20 py-10 flex flex-col gap-10 w-full max-w-6xl mx-auto ">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            className="px-2 lg:px-8 flex flex-col gap-6 justify-center"
            variants={itemVariants}
          >
            <motion.div variants={titleVariants}>
              <h1 className="text-4xl lg:text-5xl font-light  tracking-tight">
                <span className="block text-gray-800 mb-2">No Cap,</span>
                <span className="block font-bold text-primary drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  It's Tomorrow
                </span>
              </h1>
            </motion.div>

            <motion.p
              className="text-sm lg:text-base text-gray-700 leading-relaxed "
              variants={itemVariants}
            >
              Students' Gala, a district-level celebration of knowledge,
              creativity, and innovation! Bringing together thousands of higher
              secondary students, Students Gala 2025 features inspiring sessions
              on higher education, entrepreneurship, AI, and emerging
              technologies, along with vibrant arts competitions and team
              activities.
            </motion.p>
          </motion.div>

          {/* Right Column - Logo and Info */}
          <motion.div
            className="flex flex-col justify-center items-center px-2 lg:px4 max-w-md w-full mx-auto relative"
            variants={itemVariants}
          >
            <Image
              src="/redstar.png"
              alt="star"
              width={146}
              height={156}
              className="absolute -top-8 -left-14 w-20 drop-shadow-2xl drop-shadow-primary/70"
            />
            <Image
              src="hangmsg.png"
              alt="hang"
              width={720}
              height={310}
              className="w-3/4 mx-auto drop-shadow-2xl drop-shadow-secondary/40"
            />
            <div className="flex gap-2 items-center -mt-10">
              <motion.div
                variants={logoVariants}
                className="drop-shadow-2xl drop-shadow-primary/70"
              >
                <h4 className="font-normal text-lg">
                  Higher
                  <br />
                  Secondary
                </h4>
                <h3 className="font-bold text-2xl">Students'</h3>
              </motion.div>
              <motion.div
                variants={logoVariants}
                className="w-full max-w-xs lg:max-w-sm"
              >
                <Image
                  src="/logo.png"
                  width={667}
                  height={374}
                  alt="Students' Gala 2025 Logo"
                  className="w-full h-auto object-cover drop-shadow-2xl drop-shadow-secondary/40"
                  priority
                />
              </motion.div>
            </div>
            {/* Logo */}

            {/* Date and Location */}
            {/* <motion.div
              className="flex flex-row items-center justify-between w-full gap-2 "
              variants={infoVariants}
            >
              <div className="flex items-start gap-2 md:text-lg text-base">
                <Calendar className="w-6 h-6 text-primary flex-shrink-0" />
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-light">2025</span>
                  <span className="text-primary font-semibold">Nov</span>
                  <span className="text-primary font-semibold">
                    30<span className="text-black">,</span>
                  </span>
                  <span className="font-light">Sunday</span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:text-lg text-base">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="font-semibold text-primary">Vadakkekad</span>
              </div>
            </motion.div> */}

            {/* Register Button */}
          </motion.div>
        </div>
        <motion.div
          className="max-w-4xl mx-auto flex flex-col gap-6"
          variants={benefitsVariants}
        >
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "NextGen Talks",
              "Gala League",
              "Career Connect",
              "Students Rally",
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-sm bg-zinc-200/60 border border-zinc-200  backdrop-blur-xs shadow-2xl"
                variants={itemVariants}
              >
                <span className="text-lg font-semibold ">{item}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="w-max mt-2 mx-auto" variants={buttonVariants}>
            <motion.button
              className="py-4 px-8 w-max bg-primary text-white font-bold text-xl lg:text-2xl rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => {
                window.scrollTo({
                  top: document.getElementById("register")?.offsetTop,
                  behavior: "smooth",
                });
              }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Register Now
            </motion.button>
          </motion.div>
        </motion.div>

        {/* What Awaits You Section */}
        {/* <motion.div className="mt-8 lg:mt-12 " variants={benefitsVariants}>
          <div className="relative w-fit max-w-2xl mx-auto">
            <Image
              src="/football.png"
              alt="footbal"
              width={92}
              height={94}
              className="absolute -top-10 -left-10 opacity-90 drop-shadow-[0_0_20px_rgba(0,0,0,0.3)]"
            />
            <Image
              src="/redlight.png"
              alt="redlight"
              width={257}
              height={258}
              className="absolute -top-20 -right-14 opacity-90"
            />
            <Image
              src="/robot.png"
              alt="robot"
              width={125}
              height={155}
              className="absolute -top-10 -right-14 opacity-90"
            />
            <Image
              src="/bluelight.png"
              alt="bluelight"
              width={241}
              height={243}
              className="absolute -bottom-32 -left-20 "
            />
             <Image
              src="/msg.png"
              alt="msg"
              width={141}
              height={141}
              className="absolute -bottom-16 -left-16 "
            /><Image
              src="/music.png"
              alt="music"
              width={86}
              height={117}
              className="absolute -bottom-14 -right-8 "
            />
            <motion.div
              className="bg-gray-500/10  backdrop-blur-xs rounded-xl shadow-xl w-full   py-8 px-6 lg:px-10 flex flex-col gap-6 border border-gray-50"
              variants={benefitsVariants}
            >
              <motion.h2
                className="font-bold text-2xl lg:text-3xl text-secondary text-center"
                variants={benefitItemVariants}
                custom={0}
              >
                What Awaits You
              </motion.h2>

              <motion.div
                className="flex flex-col gap-1 lg:gap-4"
                variants={itemVariants}
              >
                {[
                  "Explore new-age ideas and career paths",
                  "Learn from innovators and entrepreneurs",
                  "Showcase your talents in arts and activities",
                  "Meet and connect with young changemakers",
                  "Experience a full day of fun, learning, and inspiration",
                ].map((benefit, index) => (
                  <motion.p
                    key={index}
                    className="text-sm lg:text-base font-medium pb-1 lg:pb-2 border-b-2 border-gray-300 last:border-b-0 text-center"
                    variants={benefitItemVariants}
                    custom={index + 1}
                  >
                    {benefit}
                  </motion.p>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div> */}
      </div>
    </motion.section>
  );
};

export default HeroSection;
