public class Hello{

    public static void main(String[] args) {
        System.out.println("Hello");
        boolean value = true;
        if(value == true){
            System.out.println("Boolean Value True");
        }

        // maximum range of byte is form -128 to 127
        byte data = 126;
        System.out.println(data);

        data++;
        System.out.println(data);

        data++;
        System.out.println(data);

        data++;
        System.out.println(data);

        Encapsulate object = new Encapsulate();
        System.out.println(object.getName());
    }
}