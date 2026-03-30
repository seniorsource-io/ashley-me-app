'use client'

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { searchAddresses } from "@/app/actions";
import { updateCommunity } from "@/app/actions";
import type { Community } from "@/lib/definitions";
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, Check, UserCheck, HeartHandshake, Loader2 } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const CommunityContact = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Community[]>([]);
    const [selectedItem, setSelectedItem] = useState<Community | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const isSelectingRef = useRef(false);
    const searchAnchorRef = useRef<HTMLDivElement>(null);
    const [resultsMenuPos, setResultsMenuPos] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);

    const updateResultsMenuPosition = useCallback(() => {
        const el = searchAnchorRef.current;
        if (!el || results.length === 0) return;
        const r = el.getBoundingClientRect();
        setResultsMenuPos({
            top: r.bottom + 8,
            left: r.left,
            width: r.width,
        });
    }, [results.length]);

    useEffect(() => {
        if (isSelectingRef.current) {
            isSelectingRef.current = false;
            return;
        }

        if (query.length > 2) {
            setIsSearching(true);
            const fetchResults = async () => {
                try {
                    const data = await searchAddresses(query);
                    setResults(data);
                } finally {
                    setIsSearching(false);
                }
            };
            const timeoutId = setTimeout(fetchResults, 100);
            return () => clearTimeout(timeoutId);
        } else {
            setResults([]);
            setIsSearching(false);
        }
    }, [query]);

    const handleSelect = (item: Community) => {
        isSelectingRef.current = true;
        setQuery(item.address);
        setResults([]);
        setSelectedItem(item);
    };

    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (!carouselApi) return;
        const onSelect = () => setCurrentSlide(carouselApi.selectedScrollSnap());
        onSelect();
        carouselApi.on("select", onSelect);
        return () => {
            carouselApi.off("select", onSelect);
        };
    }, [carouselApi]);

    useLayoutEffect(() => {
        if (results.length === 0) {
            setResultsMenuPos(null);
            return;
        }
        updateResultsMenuPosition();
        window.addEventListener("scroll", updateResultsMenuPosition, true);
        window.addEventListener("resize", updateResultsMenuPosition);
        const vv = window.visualViewport;
        if (vv) {
            vv.addEventListener("resize", updateResultsMenuPosition);
            vv.addEventListener("scroll", updateResultsMenuPosition);
        }
        const ro = new ResizeObserver(updateResultsMenuPosition);
        const el = searchAnchorRef.current;
        if (el) ro.observe(el);
        return () => {
            window.removeEventListener("scroll", updateResultsMenuPosition, true);
            window.removeEventListener("resize", updateResultsMenuPosition);
            if (vv) {
                vv.removeEventListener("resize", updateResultsMenuPosition);
                vv.removeEventListener("scroll", updateResultsMenuPosition);
            }
            ro.disconnect();
        };
    }, [results.length, updateResultsMenuPosition]);

    useEffect(() => {
        if (!carouselApi || results.length === 0) return;
        const onMove = () => updateResultsMenuPosition();
        carouselApi.on("scroll", onMove);
        carouselApi.on("settle", onMove);
        return () => {
            carouselApi.off("scroll", onMove);
            carouselApi.off("settle", onMove);
        };
    }, [carouselApi, results.length, updateResultsMenuPosition]);

    const [isChecked, setIsChecked] = useState(true);

    const handleApply = async (item: Community) => {

        setIsSearching(true);

        const payload = {
            sms_opt_in: isChecked,
            joinedAt: new Date(),
            _id: item._id
        };

        const response = await updateCommunity(item._id, payload);

        setIsSearching(false);

        if (response.success) {
            alert("Preferences saved!");
        } else {
            alert("Error: " + response.error);
        }
    };

    return (
        <section id="community-contact-form" className="pt-10 pb-4 pt-7 bg-secondary-paper">
            <div className="container mx-auto px-6">
                <div className="max-w-xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-4">

                        <span className="flex flex-row items-center gap-3 text-lg font-semibold uppercase justify-center tracking-widest text-accent">
                            <span className="text-primary">Sign Up Here</span>
                            <UserCheck className="w-6 h-6 text-primary" />
                        </span>

                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-6">

                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground py-0">
                            Join Our Provider Community
                        </h2>

                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="bg-card-secondary rounded-2xl shadow-xl pt-3 pb-7 sm:pt-6 sm:pb-9 h-full overflow-x-clip overflow-y-visible">
                        <div className="w-full px-6 sm:px-10">
                            <Carousel
                                setApi={setCarouselApi}
                                opts={{ align: "start", loop: false }}
                                className="w-full max-w-[420px] mx-auto"
                            >
                                <CarouselContent className="-ml-3">
                                    <CarouselItem className="pl-3 basis-full">
                                        <div className="w-full pb-2">
                                            <div className="flex flex-row items-center justify-left gap-1 mb-2">
                                                <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
                                                    <Circle
                                                        size={60}
                                                        className="fill-primary stroke-white"
                                                        strokeWidth={1.5}
                                                    />
                                                    <span className="absolute text-white font-bold text-2xl select-none">
                                                        1
                                                    </span>
                                                </div>
                                                <div className="text-primary text-2xl font-semibold leading-tight">
                                                    Find your community
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center w-full px-2">
                                                <div ref={searchAnchorRef} className="relative w-full">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your community's address..."
                                                        value={query}
                                                        onChange={(e) => {
                                                            setQuery(e.target.value);
                                                            if (selectedItem) setSelectedItem(null);
                                                        }}
                                                        className="text-gray-900 w-full p-3 border border-gray-300 rounded-md shadow-md focus:ring-2 focus:ring-primary outline-none bg-white text-center font-medium placeholder:italic"
                                                    />
                                                    {typeof document !== "undefined" &&
                                                        createPortal(
                                                            <AnimatePresence>
                                                                {results.length > 0 && resultsMenuPos && (
                                                                    <motion.ul
                                                                        key="address-results-dropdown"
                                                                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                                                        animate={{
                                                                            opacity: 1,
                                                                            scale: 1,
                                                                            y: 0,
                                                                            transition: {
                                                                                type: "spring",
                                                                                stiffness: 300,
                                                                                damping: 25,
                                                                                staggerChildren: 0.05,
                                                                            },
                                                                        }}
                                                                        exit={{
                                                                            opacity: 0,
                                                                            scale: 0.95,
                                                                            y: -5,
                                                                            transition: { duration: 0.2 },
                                                                        }}
                                                                        style={{
                                                                            position: "fixed",
                                                                            top: resultsMenuPos.top,
                                                                            left: resultsMenuPos.left,
                                                                            width: resultsMenuPos.width,
                                                                            zIndex: 100,
                                                                        }}
                                                                        className="max-h-52 overflow-y-auto overscroll-contain touch-pan-y bg-white border border-gray-100 rounded-xl shadow-2xl backdrop-blur-sm"
                                                                        onWheel={(e) => e.stopPropagation()}
                                                                    >
                                                                        {results.map((item) => (
                                                                            <motion.li
                                                                                variants={{
                                                                                    initial: { opacity: 0, x: -10 },
                                                                                    animate: { opacity: 1, x: 0 },
                                                                                }}
                                                                                key={item._id.toString()}
                                                                                className="px-4 py-3 hover:bg-primary/5 cursor-pointer text-sm text-gray-800 border-b border-gray-200 last:border-b-0 transition-colors flex items-center gap-2"
                                                                                onClick={() => handleSelect(item)}
                                                                            >
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                                                                {item.address}
                                                                            </motion.li>
                                                                        ))}
                                                                    </motion.ul>
                                                                )}
                                                            </AnimatePresence>,
                                                            document.body,
                                                        )}
                                                </div>
                                                {query.length > 2 &&
                                                    !isSearching &&
                                                    results.length === 0 &&
                                                    !selectedItem && (
                                                        <p
                                                            className="mt-2 text-center text-sm text-gray-500"
                                                            role="status"
                                                        >
                                                            No results found
                                                        </p>
                                                    )}
                                                <div className="mt-2 min-h-10 w-full">
                                                    {isSearching ? (
                                                        <div className="flex items-center justify-center">
                                                            <Loader2
                                                                className="h-9 w-9 animate-spin text-primary [animation-duration:0.6s]"
                                                                strokeWidth={2}
                                                                role="status"
                                                                aria-label="Searching"
                                                            />
                                                        </div>
                                                    ) : selectedItem ? (
                                                        <div className="flex justify-between items-center gap-3 pt-2 pb-1 px-1 w-full">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setQuery("");
                                                                    setSelectedItem(null);
                                                                    setResults([]);
                                                                }}
                                                                className="rounded-full px-5 py-2.5 text-sm font-semibold text-primary border-2 border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
                                                            >
                                                                Back
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => carouselApi?.scrollTo(1)}
                                                                className="rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-widest transition-all bg-primary text-white shadow-md hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-card-secondary cursor-pointer"
                                                            >
                                                                Continue
                                                            </button>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                    <CarouselItem className="pl-3 basis-full">
                                        <div className="w-full pb-5">
                                            <div className="flex flex-row items-center justify-start gap-1 mb-2">
                                                <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
                                                    <Circle
                                                        size={60}
                                                        className="fill-primary stroke-white"
                                                        strokeWidth={1.5}
                                                    />
                                                    <span className="absolute text-white font-bold text-2xl select-none">
                                                        2
                                                    </span>
                                                </div>
                                                <div className="text-primary text-2xl font-semibold leading-tight">
                                                    Confirm your information
                                                </div>
                                            </div>
                                            <div className="w-full min-h-[80px] mt-1 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
                                                <AnimatePresence mode="wait">
                                                    {selectedItem ? (
                                                        <motion.div
                                                            key="details"
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                                            className="grid grid-cols-2 gap-4 text-md text-center"
                                                        >
                                                            <div>
                                                                <p className="text-primary uppercase text-xs font-bold truncate">First Name</p>
                                                                <p>{selectedItem.firstname}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-primary uppercase text-xs font-bold truncate">Last Name</p>
                                                                <p>{selectedItem.lastname}</p>
                                                            </div>
                                                            <div className="col-span-2 my-2 border-t border-gray-200" />
                                                            <div>
                                                                <p className="text-primary uppercase text-xs font-bold">Phone</p>
                                                                <p>{selectedItem.phone || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-primary uppercase text-xs font-bold">Email</p>
                                                                <p className="truncate">{selectedItem.email || "N/A"}</p>
                                                            </div>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="placeholder"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex items-center justify-center min-h-[120px]"
                                                        >
                                                            <p className="text-gray-400 italic text-md text-center px-2">
                                                                Select an address to confirm contact information.
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <div className="flex justify-between items-center gap-3 pt-4 pb-1 px-1">
                                                <button
                                                    type="button"
                                                    onClick={() => carouselApi?.scrollTo(0)}
                                                    className="rounded-full px-5 py-2.5 text-sm font-semibold text-primary border-2 border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={!selectedItem}
                                                    onClick={() => carouselApi?.scrollTo(2)}
                                                    className={cn(
                                                        "rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-widest transition-all",
                                                        selectedItem
                                                            ? "bg-primary text-white shadow-md hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-card-secondary cursor-pointer"
                                                            : "bg-gray-200 text-gray-400 cursor-not-allowed",
                                                    )}
                                                >
                                                    Continue
                                                </button>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                    <CarouselItem className="pl-3 basis-full">
                                        <div className="w-full pb-2">
                                            <div className="flex flex-col items-start gap-1 w-full">
                                                <div className="flex flex-row items-center justify-start gap-1 mb-0">
                                                    <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
                                                        <Circle
                                                            size={60}
                                                            className="fill-primary stroke-white"
                                                            strokeWidth={1.5}
                                                        />
                                                        <span className="absolute text-white font-bold text-2xl select-none">
                                                            3
                                                        </span>
                                                    </div>
                                                    <div className="text-primary text-2xl font-semibold leading-tight">
                                                        Opt into messaging and apply
                                                    </div>
                                                </div>
                                                <label className="group flex items-center justify-center gap-3 cursor-pointer select-none w-full sm:w-fit py-1 px-1 sm:px-5 mb-1">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only"
                                                        checked={isChecked}
                                                        onChange={() => setIsChecked(!isChecked)}
                                                    />
                                                    <div
                                                        className={
                                                            isChecked
                                                                ? "flex items-center justify-center w-7 h-7 rounded-md border-2 transition-all duration-300 bg-primary border-primary shrink-0"
                                                                : "flex items-center justify-center w-7 h-7 rounded-md border-2 transition-all duration-300 bg-white border-gray-300 group-hover:border-primary shrink-0"
                                                        }
                                                    >
                                                        <Check
                                                            size={18}
                                                            className={isChecked ? "text-white opacity-100 transition-opacity" : "opacity-0"}
                                                            strokeWidth={4}
                                                        />
                                                    </div>
                                                    <span
                                                        className={
                                                            isChecked
                                                                ? "text-base sm:text-lg tracking-wide font-medium text-primary leading-none"
                                                                : "text-base sm:text-lg tracking-wide font-medium text-gray-600 leading-none"
                                                        }
                                                    >
                                                        Contact me by text messaging (sms)
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="w-full flex flex-wrap justify-center items-center gap-3 py-10">
                                                <button
                                                    type="button"
                                                    onClick={() => carouselApi?.scrollTo(1)}
                                                    className="rounded-full px-5 py-2.5 text-sm font-semibold text-primary border-2 border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
                                                >
                                                    Back
                                                </button>
                                                {selectedItem ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => selectedItem && handleApply(selectedItem)}
                                                        className="group relative z-10 w-fit inline-flex items-center justify-center gap-2 bg-primary hover:ring-2 hover:ring-primary hover:ring-offset-2 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg uppercase text-sm tracking-widest cursor-pointer"
                                                    >
                                                        <span>Apply Now to Join</span>
                                                        <HeartHandshake
                                                            size={20}
                                                            className="transition-transform duration-300 group-hover:scale-120"
                                                        />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="group relative z-10 w-fit inline-flex items-center justify-center gap-2 text-gray-400 py-3 px-6 rounded-full transition-all duration-300 shadow-lg text-md italic outline-1 outline-gray-300"
                                                    >
                                                        <span>Select address to apply</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </CarouselItem>
                                </CarouselContent>
                            </Carousel>
                            <div className="flex justify-center items-center gap-2 pt-4 pb-1">
                                {[0, 1, 2].map((index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        aria-label={`Go to step ${index + 1}`}
                                        onClick={() => carouselApi?.scrollTo(index)}
                                        className={cn(
                                            "h-2.5 rounded-full transition-all duration-300",
                                            currentSlide === index
                                                ? "w-8 bg-primary"
                                                : "w-2.5 bg-primary/30 hover:bg-primary/50",
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section >

    );
};

export default CommunityContact;
