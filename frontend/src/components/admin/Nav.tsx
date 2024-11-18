import { ModeToggle } from "./ToggleTheme";

const Nav = () => {
    return (
        <nav className="sticky top-0 p-2 bg-primary-foreground z-10 border-r border-b h-14 flex-1">
            <ModeToggle />
        </nav>
    );
};

export default Nav;
