<script>
  import { onMount, onDestroy } from 'svelte';
  import { initAnimations } from './lib/animations.js';
  import ImageSlot from './lib/ImageSlot.svelte';

  let appRef;
  let cleanupAnimations;

  onMount(() => {
    if (appRef) {
      cleanupAnimations = initAnimations(appRef);
    }
  });

  onDestroy(() => {
    if (cleanupAnimations) cleanupAnimations();
  });
</script>

<div bind:this={appRef} class="rare-bird-app">
  <!-- intro curtain -->
  <div class="loader" aria-hidden="true">
    <p class="loader-word">Rare <em>Bird</em></p>
    <div class="loader-dots"><span></span><span></span><span></span></div>
  </div>
  <div class="lp lp-a" aria-hidden="true"></div>
  <div class="lp lp-b" aria-hidden="true"></div>

  <header class="site-header">
    <div class="container">
      <a class="logo" href="#top">
        <img class="logo-mark" src="/logo.svg" width="34" height="34" alt="Rare Bird" />
        <span class="logo-word">Rare Bird</span>
      </a>
      <nav class="site-nav">
        <a href="#program">The Program</a>
        <a href="#schools">For Schools</a>
        <a href="#story">Our Story</a>
        <a class="btn btn-primary" href="#contact">Partner with us</a>
      </nav>
    </div>
  </header>

  <div id="smooth-wrapper">
    <div id="smooth-content">
      <main id="top">
        <!-- ============ HERO ============ -->
        <section class="hero" data-screen-label="Hero">
          <div class="container">
            <div class="hero-copy">
              <span class="eyebrow">In-school support · New Orleans</span>
              <h1>Every child belongs in the <em>classroom.</em></h1>
              <p class="hero-sub">Rare Bird partners with New Orleans schools to give children with disabilities one-on-one support — so they can learn, play, and grow right alongside their peers.</p>
              <div class="hero-ctas">
                <a class="btn btn-primary" href="#contact">Partner with your school <span class="arrow">&rarr;</span></a>
                <a class="btn btn-ghost" href="#program">How it works</a>
              </div>
            </div>
            <div class="hero-visual">
              <div class="shape shape-circle" data-speed="0.88"></div>
              <div class="shape shape-half" data-speed="0.92"></div>
              <div class="arch-wrap">
                <div class="arch-clip">
                  <ImageSlot id="hero-photo" shape="rect" src="/hero.svg" fit="contain" placeholder="Rare Bird" />
                </div>
              </div>
              <div class="shape shape-ring" data-speed="1.12"></div>
              <div class="shape shape-dot" data-speed="1.2"></div>
            </div>
          </div>
          <div class="scroll-cue">Scroll</div>
        </section>

        <!-- ============ MARQUEE ============ -->
        <div class="marquee" aria-hidden="true">
          <div class="marquee-track">
            <span class="m-item">Belonging</span><span class="m-dot"></span>
            <span class="m-item">Dignity</span><span class="m-dot"></span>
            <span class="m-item">Joy</span><span class="m-dot"></span>
            <span class="m-item">Curiosity</span><span class="m-dot"></span>
            <span class="m-item">Community</span><span class="m-dot"></span>
            <span class="m-item">Independence</span><span class="m-dot"></span>
            <span class="m-item">Belonging</span><span class="m-dot"></span>
            <span class="m-item">Dignity</span><span class="m-dot"></span>
            <span class="m-item">Joy</span><span class="m-dot"></span>
            <span class="m-item">Curiosity</span><span class="m-dot"></span>
            <span class="m-item">Community</span><span class="m-dot"></span>
            <span class="m-item">Independence</span><span class="m-dot"></span>
          </div>
        </div>

        <!-- ============ MISSION ============ -->
        <section class="mission" data-screen-label="Mission">
          <div class="container">
            <span class="eyebrow">Our mission</span>
            <p class="mission-statement">We believe disability is never a barrier to <em class="hl">belonging</em>. So we bring support to the child — inside the school day, inside the classroom, inside the life of the school — because no child should have to <em class="hl">leave the room</em> to be included.</p>
          </div>
        </section>

        <!-- ============ HOW IT WORKS ============ -->
        <section class="program" id="program" data-screen-label="How the program works">
          <div class="program-pin">
            <div class="container">
              <div class="section-head">
                <span class="eyebrow" data-reveal>The program</span>
                <h2 data-split>Support that meets children where they already are.</h2>
                <p class="lede" data-reveal>No pull-out programs. No separate rooms. Rare Bird embeds trained inclusion specialists in the classrooms children already call their own.</p>
              </div>
              <div class="steps-mask">
                <div class="steps" data-reveal-group>
                  <article class="step" data-reveal>
                    <span class="step-num">01</span>
                    <h3>Listen first</h3>
                    <p>Every partnership starts with the child — their strengths, their needs, and the people who know them best. We sit down with families and teachers to build a plan around the whole child.</p>
                  </article>
                  <article class="step" data-reveal>
                    <span class="step-num">02</span>
                    <h3>Support in the classroom</h3>
                    <p>Our inclusion specialists work beside the child through the school day — in their own classroom, with their own friends — never apart from them.</p>
                  </article>
                  <article class="step" data-reveal>
                    <span class="step-num">03</span>
                    <h3>Grow toward independence</h3>
                    <p>We coach teachers, share progress with families, and step back gradually as confidence grows. Success looks like support that's no longer needed.</p>
                  </article>
                </div>
              </div>
              <div class="steps-progress"><span></span></div>
            </div>
          </div>
        </section>

        <!-- ============ FOR SCHOOLS ============ -->
        <section class="schools" id="schools" data-screen-label="For schools">
          <div class="container">
            <div class="schools-copy">
              <span class="eyebrow">For schools &amp; districts</span>
              <h2 data-split>Inclusion shouldn't depend on what your school can staff.</h2>
              <p class="lede">We bring the specialists, the training, and the experience — and we work inside the systems you already run. Your teachers get a partner in the room, not another program to manage.</p>
              <a class="btn btn-on-accent" href="#contact">Start a conversation <span class="arrow">&rarr;</span></a>
              <p class="schools-note">Currently partnering with schools across Greater New Orleans.</p>
            </div>
            <ul class="school-points" data-reveal-group>
              <li data-reveal>
                <svg class="point-icon" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true"><circle cx="13" cy="13" r="11.5" stroke-width="1.5"></circle><path d="M8 13.2l3.4 3.4L18 10" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                <span>Specialists embedded in your classrooms — not pull-out programs</span>
              </li>
              <li data-reveal>
                <svg class="point-icon" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true"><circle cx="13" cy="13" r="11.5" stroke-width="1.5"></circle><path d="M8 13.2l3.4 3.4L18 10" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                <span>Aligned with your IEP and 504 processes from day one</span>
              </li>
              <li data-reveal>
                <svg class="point-icon" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true"><circle cx="13" cy="13" r="11.5" stroke-width="1.5"></circle><path d="M8 13.2l3.4 3.4L18 10" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                <span>Professional development and coaching for your whole staff</span>
              </li>
              <li data-reveal>
                <svg class="point-icon" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true"><circle cx="13" cy="13" r="11.5" stroke-width="1.5"></circle><path d="M8 13.2l3.4 3.4L18 10" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                <span>Partnership models sized to your school — one child or a whole grade</span>
              </li>
            </ul>
          </div>
        </section>

        <!-- ============ STORY + TEAM ============ -->
        <section class="story" id="story" data-screen-label="Our story">
          <div class="container">
            <div class="story-grid">
              <div class="story-copy">
                <span class="eyebrow" data-reveal>Our story</span>
                <h2 data-split>Made in New Orleans, for New Orleans.</h2>
                <p data-reveal>Rare Bird was started by educators, therapists, and parents who kept watching the same story unfold: a child with a disability enrolls, a school wants to do right by them, and nobody has the support to make it work.</p>
                <p data-reveal>We built the organization we wished existed — one that brings real expertise into real classrooms, in the city we call home.</p>
                <p class="story-pull" data-reveal>A rare bird isn't an exception to be managed. It's something to celebrate.</p>
              </div>
              <div class="story-collage">
                <div class="collage-shape"></div>
                <div class="collage-arch" data-speed="0.95">
                  <div class="arch-clip">
                    <ImageSlot id="story-photo-1" shape="rect" src="/logo.svg" fit="contain" placeholder="Rare Bird" />
                  </div>
                </div>
                <div class="collage-circle" data-speed="1.08">
                  <ImageSlot id="story-photo-2" shape="circle" src="/favicon.svg" fit="contain" placeholder="Rare Bird" />
                </div>
              </div>
            </div>

            <div class="team-row" data-reveal-group>
              <div class="team-card" data-reveal>
                <ImageSlot id="team-1" shape="circle" src="/theo.jpg" placeholder="Taylor Triplett" />
                <p class="team-name">Taylor &ldquo;Theo&rdquo; Triplett</p>
                <p class="team-role">Executive Director</p>
              </div>
              <div class="team-card" data-reveal>
                <ImageSlot id="team-2" shape="circle" src="/lisa.jpg" placeholder="Lisa Brown" />
                <p class="team-name">Lisa Brown</p>
                <p class="team-role">Clinical Coordinator</p>
              </div>
              <div class="team-card" data-reveal>
                <ImageSlot id="team-3" shape="circle" src="/gabby.png" placeholder="Gabriella Stewart" />
                <p class="team-name">Gabriella Stewart</p>
                <p class="team-role">Director of Programs</p>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ CONTACT ============ -->
        <section class="contact" id="contact" data-screen-label="Contact">
          <div class="container contact-inner">
            <div class="contact-copy">
              <span class="eyebrow" data-reveal>Get started</span>
              <h2 data-split>Let's make room for every rare bird.</h2>
              <p data-reveal>Whether you lead a school, love a child, or want to support the work — we'd love to hear from you.</p>
              <a class="contact-email" href="mailto:hello@rarebird.org" data-reveal>hello@rarebird.org</a>
            </div>
            <form class="contact-form" data-reveal on:submit|preventDefault>
              <div class="field">
                <label for="cf-name">Name</label>
                <input id="cf-name" type="text" placeholder="Your name" />
              </div>
              <div class="field">
                <label for="cf-email">Email</label>
                <input id="cf-email" type="email" placeholder="you@school.org" />
              </div>
              <div class="field full">
                <label for="cf-school">School or organization</label>
                <input id="cf-school" type="text" placeholder="Where do you work or learn?" />
              </div>
              <div class="field full">
                <label for="cf-message">Message</label>
                <textarea id="cf-message" rows="4" placeholder="Tell us a little about your school or your child."></textarea>
              </div>
              <button class="btn btn-primary" type="submit">Send message <span class="arrow">&rarr;</span></button>
            </form>
          </div>
        </section>
      </main>

      <!-- ============ FOOTER ============ -->
      <footer class="site-footer" data-screen-label="Footer">
        <div class="container">
          <div class="footer-top">
            <p class="footer-word">Rare <em>Bird</em></p>
            <nav class="footer-nav">
              <a href="#program">The Program</a>
              <a href="#schools">For Schools</a>
              <a href="#story">Our Story</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
          <div class="footer-bottom">
            <span>&copy; 2026 Rare Bird</span>
            <span>New Orleans, Louisiana</span>
          </div>
        </div>
      </footer>
    </div>
  </div>

  <div class="grain" aria-hidden="true"></div>
</div>
