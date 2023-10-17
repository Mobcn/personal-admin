import { ElImageViewer } from 'element-plus';

/**
 * 展示图片
 *
 * @param urls 图片地址
 */
export default function ShowImage(urls: string | string[]) {
    const div = document.createElement('div');
    const app = createApp(
        h(ElImageViewer, {
            urlList: typeof urls === 'string' ? [urls] : urls,
            onClose: () => {
                app.unmount();
                div.remove();
            }
        })
    );
    app.mount(div);
    document.body.appendChild(div);
}
