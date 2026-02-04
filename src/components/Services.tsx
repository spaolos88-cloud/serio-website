import { motion } from 'framer-motion';
import { Mic2, Layers, Cpu, Radio, Volume2, Globe } from 'lucide-react';

const Services = () => {
    const services = [
        {
            icon: <Volume2 className="w-8 h-8" />,
            title: "Sound Design",
            desc: "Custom sonic landscapes and unique foley for cinema, games, and VR environments."
        },
        {
            icon: <Layers className="w-8 h-8" />,
            title: "Expert Mixing",
            desc: "Balanced, immersive mixes in Stereo and Surround Sound formats (5.1/7.1)."
        },
        {
            icon: <Cpu className="w-8 h-8" />,
            title: "Post-Production",
            desc: "Full audio cleanup, restoration, and seamless dialogue editing."
        },
        {
            icon: <Mic2 className="w-8 h-8" />,
            title: "VO Direction",
            desc: "High-end vocal recording and direction for advertisements and narrations."
        },
        {
            icon: <Radio className="w-8 h-8" />,
            title: "Broadcast Audio",
            desc: "Loudness normalization and compliance for global broadcast standards."
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: "Localization",
            desc: "Audio adaptation and dubbing services for international market reach."
        }
    ];

    return (
        <section id="services" className="py-24 px-6 md:px-12 bg-surface/30">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-xs font-mono text-cyan uppercase tracking-[0.4em] mb-4">Core Capabilities</h2>
                        <h3 className="text-4xl md:text-5xl font-display font-bold text-white">MODERN AUDIO PROTOCOLS</h3>
                    </div>
                    <p className="text-textDim max-w-xs text-sm font-light">
                        Integrated engineering solutions for the most demanding digital media requirements.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-brushed-metal border border-white/5 p-8 rounded-xl glass-hover group"
                        >
                            <div className="text-cyan/60 group-hover:text-cyan transition-colors mb-6 transform group-hover:scale-110 duration-300">
                                {item.icon}
                            </div>
                            <h4 className="text-xl font-display font-bold text-white mb-4 tracking-tight group-hover:text-glow transition-all">
                                {item.title}
                            </h4>
                            <p className="text-textDim text-sm font-light leading-relaxed">
                                {item.desc}
                            </p>
                            <div className="mt-8 flex justify-end">
                                <span className="text-[10px] font-mono text-white/10 group-hover:text-cyan/40 transition-colors uppercase tracking-[0.2em]">
                                    Module-0{i + 1}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
