import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import { Page } from 'components/Acnw/Page'
import React from 'react'

import { dangerColor } from '../assets/jss/material-kit-react'
import { configuration } from '../utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    red: {
      color: dangerColor,
    },
  })
)

export const AntiHarassmentPolicy = () => {
  const classes = useStyles()

  return (
    <Page>
      <h1>AmberCon NW's Anti-harassment policy</h1>

      <p>
        AmberCon Northwest's policy is adapted from policy samples created by and posted as an open-source resource on
        the{' '}
        <a href='http://geekfeminism.wikia.com/wiki/Conference_anti-harassment/Policy' target='_new'>
          Geek Feminism Wiki
        </a>
        . We will continue to adapt it each year as our understanding grows.
      </p>

      <p>You must read and agree to abide by this policy as a condition of attending AmberCon NW.</p>

      {configuration.virtual && (
        <p className={classes.red}>
          For {configuration.year}'s virtual AmberCon NW, we have an adapted policy{' '}
          <a href='/' target='_new'>
            here
          </a>
          .
        </p>
      )}

      <p>ACNW, as a small RPG convention, faces specific challenges in implementing a formal harassment policy.</p>
      <ol>
        <li>it does not have a team of non-participant organizers; and</li>
        <li>
          there is implicit and explicit content in some games that at least verbally treads in areas normally
          off-limits in wider public spaces.
        </li>
      </ol>

      <p>
        These challenges, however, do not mean we can't have a safe, welcoming convention, and will not discourage us
        from making explicit our support for all attendees to have a harassment-free conference experience.
      </p>

      <h2>Informally ...</h2>

      <p>
        The informal version has always been: if you make other people's convention experience uncomfortable and persist
        in doing so after being notified, you will likely find yourself dis-included for the remainder of the
        convention. If you make anyone in the hotel feel unsafe, you will definitely find yourself dis-included from the
        convention.
      </p>

      <p>
        Sounds great, but the weakness of such an implicit policy is that people who experience harassment in gaming
        spaces are often made to feel that their experience is accepted by the group in general, or they don't know who
        to report to, or when to do so. (Answers: a designated report person, below, or emergency services, depending on
        need, ASAP.)
      </p>

      <h2>Formally - The TL:DR version</h2>

      <p>
        AmberCon NW is dedicated to providing a harassment-free conference experience for everyone, regardless of
        gender, gender identity and expression, sexual orientation, disability, physical appearance, body size, race,
        age, or religion. We do not tolerate harassment of conference participants in any form.
      </p>

      <p>
        Remember, even if you do not believe that your behavior is harassment, if the recipient does, you need to stop.
      </p>

      <p>
        Conference participants violating these rules may be sanctioned or expelled from the convention without a refund
        at the discretion of the organizers.
      </p>

      <h2>Details: what does this mean ?</h2>

      <p>Harassment includes, but is not limited to:</p>
      <ul>
        <li>
          Verbal comments that degrade others based on gender, gender identity and expression, sexual orientation,
          disability, physical appearance, body size, race, age, or religion. (while some games / NPC acting may tread
          in these areas, we suggest explicit and continuing consent from participants--or adjusting your game to
          dis-include such necessities)
        </li>
        <li>Sexual images in public spaces (if you are sharing such artwork privately, it should be with consent)</li>
        <li>Deliberate intimidation, stalking, or following (NEVER)</li>
        <li>Harassing photography or recording (NEVER)</li>
        <li>
          Sustained disruption of events (take your cues from the other players and GMs before you are asked to leave)
        </li>
        <li>Inappropriate or non-consensual physical contact (NEVER)</li>
        <li>Unwelcome sexual attention (NEVER)</li>
        <li>Advocating for, or encouraging, any of the above behavior (NEVER)</li>
      </ul>
      <p>
        Again, even if you do not believe that your behavior is harassment, if the recipient does, you need to stop.
      </p>

      <h3>But we play games! What about "in-character" and "out-of-character" speech and actions?</h3>

      <p>
        The best write up I've seen so far about gaming, trigger issues, community, and consent is here:
        <a href='https://nordiclarp.org/2017/03/24/the-consent-and-community-safety-manifesto/' target='_new'>
          https://nordiclarp.org/2017/03/24/the-consent-and-community-safety-manifesto/
        </a>
      </p>

      <p>
        "<strong>Community Safety is everyone's responsibility</strong>. For a community to be safe, all of its members
        must: uphold the agreed-upon social contract of respectful behavior; be intolerant of harassment, abuse, and
        assault within the group; share the duty of monitoring behavior and educating new members; support the decisions
        of organizers to enforce safety norms; and respect and offer support to those who make reports of safety
        violations."
      </p>

      <p>
        GMs and players as individuals and as a social group share equally the responsibility to prevent harassment and
        to make all attendees feel safe and included. If you've read Zelazny's books, however, you know they are full of
        behavior and language and situations that any person could agree would be inappropriate behavior today. Further,
        the "indie-game" community and many of us at AmberCon design games intended to explore difficult social
        subjects, including racism, sexism, violence, mind-control, magic, and oppression.
      </p>

      <p>
        The line between harassment and creative exploration may be fine sometimes. If your game includes such themes,
        as GM, we suggest you first READ THE ABOVE LINK. You should also make your intent to explore such content
        explicitly clear in your game descriptions--as most of you do. As a player, make sure to ask before you
        introduce such a topic into a game. Even so, when such topics are going to arise, you can explicitly offer
        alternatives, including "fade to black."
      </p>

      <h3>Trigger issues:</h3>
      <p>
        We understand there can be social pressure to carry on with scenes that to a given player may push a trigger
        issue, or that a player is surprised to find they are uncomfortable with. There are safety tools you can use in
        gaming as both GM and player, including timing out and judgment-free withdrawal by any participant; "Green,
        Yellow, Red" signalling by which players might show they are finding something progressively too difficult;
        pre-agreed "Safe Words;" and many others. We suggest "Time Out / Safe Word" at a minimum.
      </p>

      <p>
        Whatever system you feel comfortable using in your game--AND EVEN IF YOU DON'T FEEL COMFORTABLE USING ONE AT
        ALL--if a player indicates that something is happening in your game that is problematic for them out of
        character, and you persist in doing it, you are doing the wrong thing. You may even be harassing them. AmberCon
        NW does not tolerate harassment.
      </p>

      <p>
        There may be a game that you as a player may realize, after the fact, is simply about a plot that is problematic
        for you. If it doesn't seem like an issue of personal harassment by another individual, you should always feel
        free to ask the GM for a side conference to work out the issue, and/or to bow out of the game, judgment free.
      </p>

      <p>
        We suggest that any player or GM who notices another player's discomfort at least check in, and give that person
        the opportunity to say whether the upset is in- or out-of-character, and whether it is something the person
        wants to carry on with or not.
      </p>

      <p>
        For example, some people love emotional role-play, but might get overwhelmed in a scene that has a lot of anger.
        If someone indicates this / withdraws / calls a safeword / points to their yellow or red light ribbon, you can
        choose to tone it down or wrap the scene. Failing to do so may not formally be "harassment," but it certainly is
        not contributing to every member's fun.
      </p>

      <p>
        Here's a nice article from the Nordic LARP community about "bleed" between player and character:
        <a href='https://nordiclarp.org/2015/03/02/bleed-the-spillover-between-player-and-character/' target='_new'>
          https://nordiclarp.org/2015/03/02/bleed-the-spillover-between-player-and-character/
        </a>
      </p>

      <h2>Enforcement</h2>

      <p>
        Participants asked to stop any harassing behavior are expected to comply immediately. If a participant engages
        in harassing behavior, event organizers retain the right to take any actions to keep the event a welcoming
        environment for all participants. This includes warning the offender or expulsion from the con with no refund.
        Event organizers may take action to redress anything designed to, or with the clear impact of, disrupting the
        event or making the environment hostile for any participants. We expect participants to follow these rules in
        all event spaces and event-related social activities. We think people should follow these rules outside event
        activities too!
      </p>
      <p>
        McMenamins Edgefield is a (very) alcohol-friendly venue. Drinking to excess will NOT be considered a mitigating
        factor in our consideration of harassing behavior. If you harass someone while you are drunk and make them feel
        unsafe, or use drunkenness as an excuse for behaving or talking inappropriately, you may still be expelled.
      </p>

      <h3>Reporting</h3>

      <p>
        Harassment and other code of conduct violations reduce the value of our event for everyone. We want you to be
        happy at our event. People like you make our event a better place.
      </p>

      <p>
        If someone--whether an attendee or another member of the public--makes you or anyone else feel unsafe or
        unwelcome, and you wish to make a report in person, please come to one of our designated volunteers:
      </p>

      <p>
        Contact information for these volunteers will be available as part of your registration packet. You can also
        make your report anonymously.
      </p>

      <p>
        In cases of harassment by people from outside the convention, reporting to the closest member of hotel staff may
        be the most expedient thing to do. You can also report to Simone.
      </p>

      <p>
        If you feel you or someone else is in immediate danger, go directly to the nearest McMenamins staff member (the
        front desk is staffed 24 hours). You can also dial 911.
      </p>

      <h3>Anonymous Report</h3>

      <p>
        We don't yet have the ability to take electronic anonymous reports. If you would like to make an anonymous
        report, you can write a note and leave it for Simone Cooper at the front desk. We can't follow up an anonymous
        report with you directly, but we will fully investigate it and take whatever action is necessary to prevent a
        recurrence.
      </p>

      <h3>Personal Report</h3>

      <p>You can make a personal report by contacting one of the designated volunteers, above.</p>

      <p>
        In case of a safety issue, you may also seek assistance from the hotel staff. The front desk is monitored 24
        hours a day.
      </p>

      <p>
        If we are taking a report from you in person, you should expect that we will go to a separate room area to
        ensure you are safe and cannot be overheard. If you feel comfortable, we will also involve a second person of
        your choice to ensure your report is managed properly. Once safe, we'll ask you to tell us about what happened.
        This can be upsetting, but we'll handle it as respectfully as possible, and you can bring someone to support
        you. You won't be asked to confront anyone and we won't tell anyone who you are. If you do not feel the person
        you have gone to is right for you, you can request that an additional or different person be present.
      </p>

      <p>
        We are also happy to help you contact hotel/venue security, local law enforcement, local support services,
        provide escorts, or otherwise assist you to feel safe for the duration of the event.
      </p>

      <p>We value your attendance.</p>

      <h2>Other resources</h2>
      <ul>
        <li>503-669-8610 (Edgefield Front Desk)</li>
        <li>503-823-3333 (City of Troutdale and Multnomah County non-emergency police)</li>
        <li>911 (emergency)</li>
        <li>800-656-HOPE (4673) (RAINN Sexual Assault Hotline)</li>
      </ul>
    </Page>
  )
}
