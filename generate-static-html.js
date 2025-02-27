import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to create static HTML with SEO content
async function generateStaticHTML() {
  console.log('Generating static HTML for SEO...');
  
  try {
    // Read the built index.html file
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    const htmlContent = fs.readFileSync(indexPath, 'utf8');
    
    // Create a DOM from the HTML content
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;
    
    // Get the root element where React will mount
    const rootElement = document.getElementById('root');
    
    // Add static HTML content for SEO
    rootElement.innerHTML = `
      <!-- This content will be replaced by React but provides SEO content for crawlers -->
      <header class="fixed top-0 left-0 right-0 z-50 bg-[rgba(15,15,25,0.6)] backdrop-blur-md py-4">
        <div class="max-w-6xl mx-auto px-4">
          <div class="flex items-center justify-center md:justify-between">
            <a href="/" class="flex items-center gap-2">
              <img src="https://cdn.shopify.com/s/files/1/0665/3404/7973/files/Berries_Logo2.png" alt="One Piece Logo" class="w-10 h-10" />
              <span class="text-[#dfd0bd] text-3xl font-['Pirata_One']">Wanted Maker</span>
            </a>
            <nav class="hidden md:block">
              <ul class="flex items-center gap-6">
                <li><a href="#" class="text-white font-bold font-hanken-grotesk text-xl">Create a Wanted Poster</a></li>
                <li><a href="#faq" class="text-white font-bold font-hanken-grotesk text-xl">FAQ</a></li>
                <li><a href="#contact" class="text-white font-bold font-hanken-grotesk text-xl">Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      <main class="flex-1 pt-24 pb-8 px-4 relative">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-gradient-to-b from-[#1e1f2b] to-[#151621] backdrop-blur-lg border border-[rgba(255,255,255,0.1)] rounded-xl sm:rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.3)] p-6 sm:p-8 space-y-4">
              <div class="space-y-6">
                <div>
                  <label class="block text-gray-300 font-medium mb-2">Name</label>
                  <input type="text" class="w-full p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400" placeholder="Enter name" />
                </div>
                <div>
                  <label class="block text-gray-300 font-medium mb-2">Bounty</label>
                  <input type="text" class="w-full p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400" placeholder="Enter bounty amount" />
                </div>
                <div>
                  <label class="block text-gray-300 font-medium mb-2">Photo</label>
                  <button class="w-full bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white p-3 flex items-center justify-center gap-2">
                    Upload Photo
                  </button>
                </div>
                <button class="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white font-semibold p-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2">
                  Download Poster
                </button>
              </div>
            </div>
            <div class="relative">
              <div class="w-full h-auto bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg flex items-center justify-center">
                <div class="text-center p-6">
                  <p class="text-white text-lg">Create your own One Piece Wanted poster</p>
                </div>
              </div>
            </div>
          </div>
          
          <section class="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 text-white text-sm leading-relaxed mt-16">
            <h1 class="text-xl sm:text-xl font-semibold mb-4">
              Create Your Own Custom One Piece Wanted Posters!
            </h1>
            <p class="text-justify mb-2">
              You can now design your own <span class="font-bold">One Piece</span>-inspired 
              <span class="font-bold"> Wanted posters</span>, just like in the anime! Bring your imagination 
              to life with customizable templates that let you create posters featuring your favorite characters, 
              original creations, or even yourself!
            </p>
            <p class="text-justify mb-2">
              Are you a <span class="font-bold">One Piece</span> fan looking to make your own bounty posters?
            </p>
            <p class="text-justify mb-8">
              <span class="font-bold">Wanted Poster Generator</span> is the ultimate tool for creating 
              <strong> realistic, high-quality </strong> One Piece-style posters. Whether you're a cosplayer, 
              a content creator, or just a fan of the series, our app makes it easy to design and personalize 
              <strong> your own wanted posters </strong> in just a few clicks!
            </p>
          </section>
          
          <section id="faq" class="mt-24">
            <h2 class="text-3xl text-center text-[#fff] mb-12 font-bold">Frequently Asked Questions</h2>
            <div class="max-w-3xl mx-auto space-y-3">
              <div class="bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl p-4">
                <h3 class="text-xl text-white">What image formats are supported?</h3>
                <p class="text-[#dbd0f5] mt-2">You can upload images in JPG, PNG, and WEBP formats. For the best results, use a high-resolution image with a clean background.</p>
              </div>
              <div class="bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl p-4">
                <h3 class="text-xl text-white">Can I adjust my image's size and position?</h3>
                <p class="text-[#dbd0f5] mt-2">Yes! After uploading your image, you can move, resize, and zoom to ensure a perfect fit within the poster frame.</p>
              </div>
              <div class="bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl p-4">
                <h3 class="text-xl text-white">What's the output format and quality?</h3>
                <p class="text-[#dbd0f5] mt-2">Your poster will be downloaded in high-resolution PNG format (2000x2828 px), perfect for sharing or printing.</p>
              </div>
            </div>
          </section>
          
          <section id="contact" class="mt-24 max-w-4xl mx-auto sm:px-12 lg:px-16 text-white">
            <div class="bg-gradient-to-b from-[#1e1f2b] to-[#151621] backdrop-blur-lg border border-[rgba(255,255,255,0.1)] rounded-xl sm:rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.3)] p-6 sm:p-8 space-y-4">
              <h2 class="text-3xl text-center font-bold mb-6">Contact Us</h2>
              <p class="text-gray-300 text-center mb-6">
                Have questions or feedback? Feel free to reach out!
              </p>
              <form class="space-y-6">
                <div>
                  <label class="block text-gray-300 font-medium mb-2">Your Name</label>
                  <input type="text" class="w-full p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400" placeholder="Enter your name" />
                </div>
                <div>
                  <label class="block text-gray-300 font-medium mb-2">Your Email</label>
                  <input type="email" class="w-full p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400" placeholder="Enter your email" />
                </div>
                <div>
                  <label class="block text-gray-300 font-medium mb-2">Your Message</label>
                  <textarea rows="4" class="w-full p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400" placeholder="Enter your message"></textarea>
                </div>
                <button type="submit" class="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white font-semibold p-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2">
                  Send Message
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
      
      <footer class="bg-[#1a1b26] border-t border-[rgba(255,255,255,0.1)] py-12">
        <div class="max-w-6xl mx-auto px-6">
          <div class="flex flex-col md:flex-row items-center justify-between mb-8">
            <div class="flex items-center gap-2 mb-6 md:mb-0">
              <img src="https://cdn.shopify.com/s/files/1/0665/3404/7973/files/Berries_Logo2.png" alt="One Piece Logo" class="w-10 h-10" />
              <span class="text-[#ded1bd] text-3xl font-['Pirata_One']">Wanted Maker</span>
            </div>
          </div>
          <div class="text-center mt-8 text-gray-500 text-xs">
            <p>Created for One Piece fans. This site is not affiliated with Toei Animation or Eiichiro Oda.</p>
          </div>
        </div>
      </footer>
    `;
    
    // Create terms directory and page
    const termsDir = path.join(__dirname, 'dist', 'terms');
    if (!fs.existsSync(termsDir)) {
      fs.mkdirSync(termsDir, { recursive: true });
    }
    
    // Clone the DOM for terms page
    const termsDom = new JSDOM(htmlContent);
    const termsDocument = termsDom.window.document;
    const termsRoot = termsDocument.getElementById('root');
    
    // Add terms content
    termsRoot.innerHTML = `
      <header class="fixed top-0 left-0 right-0 z-50 bg-[rgba(15,15,25,0.6)] backdrop-blur-md py-4">
        <div class="max-w-6xl mx-auto px-4">
          <div class="flex items-center justify-center md:justify-between">
            <a href="/" class="flex items-center gap-2">
              <img src="https://cdn.shopify.com/s/files/1/0665/3404/7973/files/Berries_Logo2.png" alt="One Piece Logo" class="w-10 h-10" />
              <span class="text-[#dfd0bd] text-3xl font-['Pirata_One']">Wanted Maker</span>
            </a>
            <nav class="hidden md:block">
              <ul class="flex items-center gap-6">
                <li><a href="/" class="text-white font-bold font-hanken-grotesk text-xl">Create a Wanted Poster</a></li>
                <li><a href="/#faq" class="text-white font-bold font-hanken-grotesk text-xl">FAQ</a></li>
                <li><a href="/#contact" class="text-white font-bold font-hanken-grotesk text-xl">Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      <main class="flex-1 pt-24 pb-8 px-4 relative">
        <div class="max-w-6xl mx-auto">
          <section id="terms" class="py-12">
            <div class="container mx-auto px-4">
              <div class="max-w-4xl mx-auto space-y-8 text-white">
                <div>
                  <h1 class="text-2xl font-bold text-white mb-4">Terms and Conditions</h1>
                  <p class="text-gray-300">
                    Welcome to Wanted Maker. These terms and conditions govern your use of our website (wanted-onepiece.com) and services. By accessing or using 
                    our website, you agree to be bound by these terms. Please read them carefully before using our service.
                  </p>
                </div>

                <div>
                  <h2 class="text-xl font-semibold text-white mb-2">Introduction</h2>
                  <p class="text-gray-300">
                    Our service allows you to create custom wanted posters using our templates and the design tools available on our platform to create your customized creations.
                  </p>
                  <p class="mt-2 text-gray-300">
                    <strong class="text-white">Platform Accessibility:</strong> Our service is accessible via our website. By using this service, you agree to comply 
                    with these terms of use and acknowledge that you have read and understood our privacy policy.
                  </p>
                </div>

                <div>
                  <h2 class="text-xl font-semibold text-white mb-2">Service Usage</h2>
                  <p class="text-gray-300">
                    <strong class="text-white">Age Requirement:</strong> Children may not access or use the service unless their use is explicitly authorized by a parent, 
                    guardian, or other authorized adult (such as a teacher) who agrees to be bound by these terms.
                  </p>
                  <p class="mt-2 text-gray-300">
                    <strong class="text-white">Service Access:</strong> Subject to your compliance with these terms, you are granted a non-exclusive, limited, 
                    non-transferable, and revocable license to access and use the service for personal or non-commercial purposes. 
                    We reserve all rights not expressly granted under these terms.
                  </p>
                </div>

                <div>
                  <h2 class="text-xl font-semibold text-white mb-2">Data Security and Privacy</h2>
                  <p class="text-gray-300">
                    <strong class="text-white">Data Collection:</strong> When you use our platform, we collect the following types of data:
                  </p>
                  <ul class="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                    <li>
                      <strong class="text-white">Design Data:</strong> If you choose to share your poster in our gallery, we record the design and text of your poster 
                      in our database for public display.
                    </li>
                    <li>
                      <strong class="text-white">Order Details:</strong> When you place an order, we collect your contact information, including your name, address, 
                      and email, to process and ship your order.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 class="text-xl font-semibold text-white mb-2">Contact Us</h2>
                  <p class="text-gray-300">
                    For any other inquiries, you can send us an email via our contact form or directly at hello@cartoontoi.fr.
                  </p>
                </div>

                <div>
                  <h2 class="text-xl font-semibold text-white mb-2">Website Information</h2>
                  <p class="text-gray-300">
                    <strong class="text-white">Website Name:</strong> wanted-onepiece.com
                  </p>
                  <p class="text-gray-300">
                    <strong class="text-white">Business Name:</strong> Wanted Maker
                  </p>
                  <p class="text-gray-300">
                    <strong class="text-white">Last Updated:</strong> ${new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer class="bg-[#1a1b26] border-t border-[rgba(255,255,255,0.1)] py-12">
        <div class="max-w-6xl mx-auto px-6">
          <div class="flex flex-col md:flex-row items-center justify-between mb-8">
            <div class="flex items-center gap-2 mb-6 md:mb-0">
              <img src="https://cdn.shopify.com/s/files/1/0665/3404/7973/files/Berries_Logo2.png" alt="One Piece Logo" class="w-10 h-10" />
              <span class="text-[#ded1bd] text-3xl font-['Pirata_One']">Wanted Maker</span>
            </div>
          </div>
          <div class="text-center mt-8 text-gray-500 text-xs">
            <p>Created for One Piece fans. This site is not affiliated with Toei Animation or Eiichiro Oda.</p>
          </div>
        </div>
      </footer>
    `;
    
    // Update title and meta tags for terms page
    const termsTitle = termsDocument.querySelector('title');
    if (termsTitle) {
      termsTitle.textContent = 'Terms and Conditions - One Piece Wanted Poster Maker';
    }
    
    const termsDescription = termsDocument.querySelector('meta[name="description"]');
    if (termsDescription) {
      termsDescription.setAttribute('content', 'Terms and conditions for using the One Piece Wanted Poster Maker. Read our policies regarding usage, privacy, and more.');
    }
    
    // Write the updated HTML files
    fs.writeFileSync(indexPath, dom.serialize());
    fs.writeFileSync(path.join(termsDir, 'index.html'), termsDom.serialize());
    
    console.log('Static HTML generation completed successfully!');
  } catch (error) {
    console.error('Error generating static HTML:', error);
    process.exit(1);
  }
}

generateStaticHTML();