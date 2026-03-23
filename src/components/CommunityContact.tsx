'use client'

import Image from 'next/image';
import { useRef, useState, useEffect } from "react";
import { searchAddresses } from "@/app/actions";
import type { Community } from "@/lib/definitions";
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, Check, UserCheck, HeartHandshake } from 'lucide-react';

const CommunityContact = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Community[]>([]);
    const [selectedItem, setSelectedItem] = useState<Community | null>(null);

    // 1. Create a ref to track if we just selected something
    const isSelectingRef = useRef(false);

    useEffect(() => {
        // 2. Check the ref! If we just selected, skip the search and reset the ref.
        if (isSelectingRef.current) {
            isSelectingRef.current = false;
            return;
        }

        if (query.length > 2) {
            const fetchResults = async () => {
                const data = await searchAddresses(query);
                setResults(data);
            };
            const timeoutId = setTimeout(fetchResults, 150);
            return () => clearTimeout(timeoutId);
        } else {
            setResults([]);
        }
    }, [query]);

    // 3. Update your click handler to use the ref
    const handleSelect = (item: Community) => {
        isSelectingRef.current = true;
        setQuery(item.address);
        setResults([]);
        setSelectedItem(item); // Store the selection here
    };

    const [isChecked, setIsChecked] = useState(true);

    const handleApply = () => {
        // Add your logic here
        console.log("Application started!");
        alert("Thank you for your interest in our community!");
        // window.location.href = "/apply"; // Example redirect
    };


    return (
        <section id="community-contact-form" className="pt-0 pb-16 bg-secondary-paper">
            <div className="container mx-auto px-6">
                <div className="max-w-xl mx-auto">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-5">

                        <span className="flex flex-row items-center gap-3 text-lg font-semibold uppercase justify-center tracking-widest text-accent">
                            <span className="text-accent-coralDeep/90">Sign Up Here</span>
                            <UserCheck className="w-6 h-6 text-accent-coralDeep/90" />
                        </span>

                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="bg-card-secondary rounded-2xl shadow-xl pt-4 pb-7 sm:pt-6 sm:pb-9 h-full overflow-hidden">
                        <div className="flex flex-col items-center gap-1 w-full items-center px-6 ">

                            {/* Top: Step 1 Container */}
                            <div className="w-full sm:w-[420px] relative mb-8">

                                {/* Step 1 ROW: Circle and Step Text aligned together */}
                                <div className="flex flex-row items-center justify-left gap-2 mb-2">
                                    {/* The Circle Container */}
                                    <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
                                        <Circle
                                            size={60}
                                            className="fill-accent-coralDeep/90 stroke-white"
                                            strokeWidth={1.5}
                                        />
                                        <span className="absolute text-white font-bold text-2xl select-none">
                                            1
                                        </span>
                                    </div>

                                    {/* The Step Text aligned to the right of the circle */}
                                    <div className="text-accent-coralDeep/90 text-xl font-semibold leading-tight">
                                        Step 1:<br />Find your community address
                                    </div>
                                </div>

                                {/* Search Input below the header row */}
                                <input
                                    type="text"
                                    placeholder="Search community address..."
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        if (selectedItem) setSelectedItem(null);
                                    }}
                                    className="text-gray-900 w-full p-3 border border-gray-300 rounded-md shadow-md focus:ring-2 focus:ring-primary outline-none bg-white text-center font-medium placeholder:italic"
                                />
                                <AnimatePresence>
                                    {results.length > 0 && (
                                        <motion.ul
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute w-full z-[100] bg-white border border-gray-200 mt-1 rounded-md shadow-xl overflow-hidden">
                                            {results.map((item) => (
                                                <li
                                                    key={item._id.toString()}
                                                    className="p-3 bg-white opacity-100 hover:bg-blue-50 cursor-pointer text-sm text-gray-800 border-b last:border-b-0 transition-colors"
                                                    onClick={() => handleSelect(item)}
                                                >
                                                    {item.address}
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Middle: Step 2 Container */}
                            <div className="w-full sm:w-[420px] relative mb-8">

                                <div className="flex flex-col gap-0 w-full sm:w-[420px]">
                                    {/* Step 2 Header ROW */}
                                    <div className="flex flex-row items-center justify-start gap-2 mb-2">
                                        <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
                                            <Circle
                                                size={60} // Slightly smaller for a tighter vertical profile
                                                className="fill-accent-coralDeep/90 stroke-white"
                                                strokeWidth={1.5}
                                            />
                                            <span className="absolute text-white font-bold text-2xl select-none">
                                                2
                                            </span>
                                        </div>
                                        <div className="text-accent-coralDeep/90 text-xl font-semibold leading-tight">
                                            Step 2:<br />Confirm your contact information
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2: Display Items */}
                                <div className="w-full sm:w-[420px] min-h-[80px] mt-1 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
                                    <AnimatePresence mode="wait">
                                        {selectedItem ? (
                                            <motion.div
                                                key="details"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                                className="grid grid-cols-2 gap-4 text-md text-center">
                                                <div>
                                                    <p className="text-primary uppercase text-xs font-bold">First Name</p>
                                                    <p>{selectedItem.firstname}</p>
                                                </div>
                                                <div>
                                                    <p className="text-primary uppercase text-xs font-bold">Last Name</p>
                                                    <p>{selectedItem.lastname}</p>
                                                </div>
                                                {/* ⚡️ LIGHT GRAY SEPARATOR ⚡️ */}
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
                                                className="flex items-center justify-center h-full"
                                            >
                                                <p className="text-gray-400 italic text-md text-center">
                                                    Select address to confirm contact information...
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Bottom: Step 3 Container */}
                            <div className="w-full sm:w-[420px] relative mb-8">

                                {/* Step 3 ROW: Circle and Step Text aligned together */}
                                <div className="flex flex-col items-start gap-1 w-full sm:w-[420px]">
                                    {/* Step 3 Header ROW */}
                                    <div className="flex flex-row items-center justify-start gap-2 mb-0">
                                        {/* Reduced container to h-12 to match the circle size more closely */}
                                        <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
                                            <Circle
                                                size={60} // Slightly smaller for a tighter vertical profile
                                                className="fill-accent-coralDeep/90 stroke-white"
                                                strokeWidth={1.5}
                                            />
                                            <span className="absolute text-white font-bold text-2xl select-none">
                                                3
                                            </span>
                                        </div>
                                        <div className="text-accent-coralDeep/90 text-xl font-semibold leading-tight">
                                            Step 3:<br />Apply and select your preferences
                                        </div>
                                    </div>
                                    <label className="group flex items-center gap-3 cursor-pointer select-none w-fit py-2 px-5 mb-1">
                                        {/* Hidden Native Input */}
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={isChecked}
                                            onChange={() => setIsChecked(!isChecked)}
                                        />
                                        {/* Custom Checkbox Square */}
                                        <div
                                            className={
                                                isChecked
                                                    ? "flex items-center justify-center w-7 h-7 rounded-md border-2 transition-all duration-300 bg-accent-coralDeep/90 border-accent-coralDeep/90"
                                                    : "flex items-center justify-center w-7 h-7 rounded-md border-2 transition-all duration-300 bg-white border-gray-300 group-hover:border-accent-coralDeep/75"
                                            }
                                        >
                                            <Check
                                                size={18}
                                                className={isChecked ? "text-white opacity-100 transition-opacity" : "opacity-0"}
                                                strokeWidth={4}
                                            />
                                        </div>

                                        {/* Checkbox Label Text */}
                                        <span className={
                                            isChecked
                                                ? "text-lg tracking-wide font-medium text-accent-coralDeep"
                                                : "text-lg tracking-wide font-medium text-gray-600"
                                        }>
                                            Contact me by text message (SMS)
                                        </span>
                                    </label>

                                </div>
                                <div className="w-full flex justify-center py-2">
                                    <button
                                        onClick={handleApply}
                                        className="group relative z-10 w-fit inline-flex items-center justify-center gap-2 bg-accent-coralDeep/90 hover:bg-accent-coralDeep/75 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg uppercase text-sm tracking-widest cursor-pointer">
                                        <span>Apply Now to Join</span>
                                        <HeartHandshake
                                            size={20}
                                            className="transition-transform duration-300 group-hover:scale-120"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section >

    );
};

export default CommunityContact;
