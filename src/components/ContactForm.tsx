'use client'

import Image from 'next/image';
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Widget } from '@typeform/embed-react'

const Form = () => {
    return (
        <section id="contact-form" className="relative overflow-hidden items-center justify-center p-6">

            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/seniors-couple.jpg"
                    alt=""
                    width={740}    /* Original width */
                    height={372}   /* Original height */
                    className="w-full h-full object-cover blur-[1px]"
                />
                <div className="absolute inset-0 bg-foreground/80" />
            </div>
            <div className="container mx-auto px-6 py-6 flex items-center justify-center">
                <div className="text-center">

                    <div className="flex w-[390px] h-[600px] rounded-xl overflow-hidden">
                        <Widget
                            id="BGG10VPS"
                            style={{ width: '100%', height: '100%' }}
                            className="h-full w-full" />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Form;
