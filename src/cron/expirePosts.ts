import cron from 'node-cron';
import { PostRepository } from '../repositories/postRepository';
import { ApplicationRepository } from '../repositories/applicationRepository';

const postRepository = new PostRepository();
const applicationRepository = new ApplicationRepository();

export const startPostExpirationJob = () => {
  console.log('[CRON] Starting post expiration job setup...');

  cron.schedule('0 0  * * *', async () => {
    console.log(`[CRON] Checking expired posts...`);
    console.log('[CRON] Post expiration job initialized.');

    const now = Date.now();

    const allPosts = await postRepository.getAllPosts();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStartTimestamp = todayStart.getTime();

    const expiredPosts = allPosts.filter(
      (post) => post.status === true && Number(post.actionDate) < todayStartTimestamp,
    );
    for (const post of expiredPosts) {
      try {
        post.status = false;
        await postRepository.updatePost(post.id, { status: false });

        const applications = await applicationRepository.getApplicationsOnAPost(post.id);
        console.log(applications);
        await Promise.all(
          applications.map((app) => applicationRepository.updateApplication(app.id, { status: false })),
        );

        console.log(`[CRON] Closed post ${post.id} and updated ${applications.length} applications.`);
      } catch (err) {
        console.error(`[CRON] Failed to process post ${post.id}:`, err);
      }
    }
  });
};
